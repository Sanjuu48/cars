import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="absolute z-10 w-full">
      <nav className="mx-auto flex max-w-360 items-center justify-between bg-transparent px-6 py-4 sm:px-12">
        <Link href="/" className="text-2xl font-bold">
          <Image
            src="/logo.png"
            alt="Car Rental Logo"
            width={50}
            height={50}
            className="object-contain border-amber-800 border-2"
            priority
          />
        </Link>
        <button
          type="button"
          className="min-w-32.5 rounded-full bg-gray-200 px-6 py-2 font-medium text-gray-900 transition hover:bg-blue-700 hover:text-white"
        >
          Sign In
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
