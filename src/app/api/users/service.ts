export enum validationTypes {
  Password,
  Email,
}

export function validateUserData(
  dataToValidate: string,
  validationType: validationTypes,
) {
  if (!Object.values(validationTypes).includes(validationType))
    return "Not a valid validation Type";

  if (validationType === validationTypes.Password) {
    const minLength = 6;
    const maxLength = 72;
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,72}$/;

    if (dataToValidate.length < minLength)
      return "Password must be at least 6 characters.";
    if (dataToValidate.length > maxLength)
      return "Password must be at most 72 characters.";
    if (!regex.test(dataToValidate))
      return "Password must contain at least one letter and one number.";

    return null;
  }

  if (validationType === validationTypes.Email) {
    if (!dataToValidate.includes("@")) return "Invalid email"; //TODO Make the email constrains more robust
  }
}
