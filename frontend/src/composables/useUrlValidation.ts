export function useUrlValidation() {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  const isValidUrl = (text: string): boolean => {
    return urlRegex.test(text);
  };

  return {
    isValidUrl
  };
}