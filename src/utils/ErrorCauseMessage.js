const messageError = {
  generatorUserIdError: (id) => {
    return `The identifier must be valid - Received ID: ${id}`;
  },

  generatorUserLoginError: (data) => {
    return `Todos los campos son requeridos
    - email
    - password`;
  },

  generatorUserLoginDataError: () => {
    return `Invalid email or password`;
  },

  generatorUserAlreadyExistsError: (data) => {
    return `The user with the email: ${data.email} already exists`;
  },

  generatorUserMissingFields: (data) => {
    return `Data missing: ${data}`;
  },

  generatorTruckAlreadyExistsError: (data) => {
    return `The truck with the plates: ${data.plates} already exists`;
  },

  generatorGoogleMapsError: (data) => {
    return `Todos los campos son requeridos
    - place_id`;
  },

  generatorLocationAlreadyExistsError: (data) => {
    return `The location with id: ${data.place_id} already exists`;
  },
};

export default messageError;
