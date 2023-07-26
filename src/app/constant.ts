export const GraphqlQuery = {
    login: (fields:string) => `query UserLogin($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          ${fields}
        }
      }`,
    register: (fields:string) => `mutation CreateNewUser($email: String!, $name: String!, $password: String!) {
        createUser(userInput: {email: $email, name: $name, password: $password}) {
          ${fields}
        }
      }`
}