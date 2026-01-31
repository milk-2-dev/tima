export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold mb-4">Thima</h4>
            <p className="text-slate-400 text-sm">
              Find sports events near you
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">
                All Events
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Our Coaches
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                FAQs
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Contact Us
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>info@provolleyballtraining.com</li>
              <li>(555) 123-4567</li>
              <li>Olympic Sports Center</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
          © 2025 Pro Volleyball Training. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
