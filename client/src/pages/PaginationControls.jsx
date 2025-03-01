import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  getPageNumbers,
}) => {
  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center mt-28 space-x-2 cursor-pointer">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 border rounded-full flex items-center justify-center cursor-pointer  ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500"
            : "bg-texthead text-white hover:bg-red-500"
        } transition-colors`}
      >
        <FaChevronLeft />
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-10 h-10 border rounded-full flex items-center justify-center ${
            number === currentPage
              ? "bg-red-500 text-white"
              : "bg-white text-texthead hover:bg-red-100"
          } transition-colors`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 border rounded-full flex items-center justify-center cursor-pointer ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500"
            : "bg-texthead text-white hover:bg-red-500"
        } transition-colors`}
      >
        <FaChevronRight />
      </button>
    </div>
    // <div className="bg-[red] py-8">
    //   <h2>pagination</h2>
    // </div>
  );
};

export default PaginationControls;
