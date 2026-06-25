module.exports = {
  expo: {
    ...require("./app.json").expo,
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "https://proestoque-api-production-43c7.up.railway.app/api",
      eas: {
        projectId: "fa1b461c-5e35-4aa8-9562-642bed56dba2"
      }
    },
  },
};

