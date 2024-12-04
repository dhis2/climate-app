export const createKeyInNamespace = (engine, resource) =>
  new Promise((resolve, reject) => {
    engine
      .mutate({
        resource,
        type: "create",
        data: {},
      })
      .then((response) => {
        if (response.httpStatusCode === 201) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch(reject);
  });
