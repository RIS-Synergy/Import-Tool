import { ProjectService } from '../src/features/project/services/project.service.js';

const projectService = new ProjectService();

const filters = {
  status: [],
  piDomain: { domain: "", ror: "" },
  diffs: "All",
  orderBy: "startDate:desc",
  itemsPerPage: 100000000
};

const page = "1";

async function main() {
  const result = await projectService.findMany2({}, filters, page);

  for (const project of result.items) {
    console.log(project.id, project.risId);
    await projectService.update(project.id, project);
  }
}

main();
