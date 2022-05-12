
const ErrorMessage = (error) => {

  console.log(error);

  return <div>{error.error}</div>;
}

export default ErrorMessage;
