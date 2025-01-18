import { getAuthEndpoint } from "../src/utils/oauth2";

const url = process.argv[2]

// console.log('AUTH_SERVER', process.env.AUTH_SERVER)
// console.log('AUTH_CLIENT_ID', process.env.AUTH_CLIENT_ID)
// console.log('RIS_FA_API_KEY', process.env.RIS_FA_API_KEY)
// console.log('url', url)

async function main () {
  const result = await getAuthEndpoint(url)
  console.log(JSON.stringify(result, null, 2))
}

main()
