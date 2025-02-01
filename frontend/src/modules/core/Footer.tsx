export default function Footer() {
  return (
    <footer className="bg-[#1D4ED8] text-white mt-auto shadow-inner border-t border-blue-600">
      <div className="max-w-7xl mx-auto py-6 px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-100">&copy; {new Date().getFullYear()} muhammadderic.edutech.labs. All rights reserved.</p>

        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-[#FBBF24] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#FBBF24] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#FBBF24] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
