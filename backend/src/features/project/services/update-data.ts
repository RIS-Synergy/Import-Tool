import { parseISO } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

const timeZone = "Europe/Vienna";

function parseAndValidateDate(dateString: string | null | undefined): Date | null {
  // Handle falsy values and invalid strings
  if (!dateString || typeof dateString !== 'string' || dateString.trim() === "" || dateString === "Invalid Date") {
    return null;
  }

  try {
    const parsed = parseISO(dateString);
    return isNaN(parsed.getTime()) ? null : fromZonedTime(parsed, timeZone);
  } catch {
    return null;
  }
}

function setEndOfDay(date: Date | null): Date | null {
  if (!date) return null;

  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

interface RorInstitution {
  rorId: string;
  name: string;
}

function extractRorInstitutionsFromFunded(funded: any[]): RorInstitution[] {
  const institutions: RorInstitution[] = [];

  for (const funding of funded || []) {
    // Check if this funding has 'as' with recipients
    if (funding?.as?.recipients) {
      for (const recipient of funding.as.recipients) {
        const orgUnit = recipient?.orgUnit;
        if (orgUnit?.identifiers) {
          // Find ROR identifier
          const rorIdentifier = orgUnit.identifiers.find(
            (id: any) => id?.type === 'ROR' && id?.value
          );

          if (rorIdentifier?.value) {
            // Extract the ROR ID from the URL
            const rorMatch = rorIdentifier.value.match(/ror\.org\/(.+)$/);
            if (rorMatch && rorMatch[1]) {
              const rorId = rorMatch[1];

              // Get the institution name - use the first available name
              let name = `Research Institution ${rorId}`;
              if (orgUnit.name) {
                // Handle both array and single object cases
                if (Array.isArray(orgUnit.name)) {
                  const firstName = orgUnit.name.find(n => n?.text);
                  if (firstName) {
                    name = firstName.text;
                  }
                } else if (orgUnit.name.text) {
                  name = orgUnit.name.text;
                }
              }

              institutions.push({ rorId, name });
            }
          }
        }
      }
    }
  }

  // Remove duplicates by rorId
  const uniqueInstitutions = institutions.reduce((acc, current) => {
    if (!acc.find(item => item.rorId === current.rorId)) {
      acc.push(current);
    }
    return acc;
  }, [] as RorInstitution[]);

  return uniqueInstitutions;
}

function connectedResearchInstitutions(risDataFunded: any) {
  const institutions = extractRorInstitutionsFromFunded(risDataFunded);

  // For each institution, create a connectOrCreate object
  return institutions.map(institution => ({
    where: { rorId: institution.rorId },
    create: {
      rorId: institution.rorId,
      name: institution.name
    }
  }));
}

export function updateData(risData: any) {
  // Parse dates
  const startDate = parseAndValidateDate(risData?.startDate);
  const endDate = setEndOfDay(parseAndValidateDate(risData?.endDate));

  const riConnections = connectedResearchInstitutions(risData.funded)
  // console.log('RI Connections:', riConnections);
  // console.log('Dates', { startDate, endDate });

  return {
    startDate,
    endDate,
    status: risData?.status ?? null,

    researchInstitutions: {
      connectOrCreate: riConnections
    },
  }
};
