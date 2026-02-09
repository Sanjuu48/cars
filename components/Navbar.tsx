import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="absolute z-10 w-full">
      <nav className="mx-auto flex max-w-360 items-center justify-between bg-transparent px-6 py-4 sm:px-12">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Car Rental Logo"
            width={50}
            height={50}
            className="object-contain"
            priority
          />
          <span className="hidden sm:inline">Car Rental</span>
        </Link>

        <Link
          href="/signin"
          className="min-w-22.5 rounded-full bg-gray-200 px-6 py-2 font-medium text-gray-900 transition hover:bg-blue-900 hover:text-white"
        >
          Log In
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
