const messageError = {
  generatorUserIdError: (id) => {
    return `The identifier must be valid - Received ID: ${id}`;
  },

  generatorUserLoginError: (data) => {
    return `Todos los campos son requeridos
    - email: ${data.email}
    - password: ${data.password}`;
  },

  generatorUserLoginDataError: () => {
    return `Invalid email or password`;
  },

};

export default messageError;
