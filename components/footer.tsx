import Container from "./container";

const Footer = () => {
  return (
    <footer className="border-t">
      <Container>
        <div className="py-8 justify-center flex flex-col lg:flex-row items-center text-gray-500">
          <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
            &copy; {new Date().getFullYear()} Powered By{" "}
            <a
              href="https://w3h5.com"
              className="mx-1 hover:underline"
              target="_blank"
            >
              W3H5.COM.
            </a>
            &
            <a
              href="https://github.com/ideshun/bing-wallpaper"
              className="mx-1 hover:underline"
              target="_blank"
            >
              GitHub
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
