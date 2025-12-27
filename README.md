# CodeExchanger

A **collaborative code editor** built with **Next.js**, **Firebase**, and **CodeMirror**, allowing you to **create, edit, store, and share code snippets** seamlessly in real-time.

---

## ✨ Features

✅ **Realtime Collaborative Editing** via Firebase  
✅ **Multi-language syntax highlighting** (JavaScript, Python, Java, TypeScript, JSON, etc.)  
✅ **VS Code-like theming (One Dark)** for developer comfort  
✅ **Create, Rename, and Delete Notes** easily  
✅ **Download snippets** in your desired language format  
✅ **Responsive and developer-friendly UI**  
✅ Built with **Next.js App Router, Tailwind CSS, and Geist Fonts**

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/codeexchanger.git
cd codeexchanger
2️⃣ Install Dependencies
bash
Copy
Edit
npm install
# or
yarn install
# or
pnpm install
3️⃣ Set Up Firebase
Go to Firebase Console and create a project.

Enable Realtime Database and set read/write rules.

Enable Anonymous Authentication if using live presence features.

Copy your Firebase configuration and add it to your .env.local file:

env
Copy
Edit
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
4️⃣ Run the Development Server
bash
Copy
Edit
npm run dev
Visit http://localhost:3000 to use your collaborative code editor.

🗂️ Folder Structure
app/ - Next.js App Router pages

components/ - React components (CodeEditor, NoteList, etc.)

lib/ - Firebase config and auth logic

public/ - Favicons and static assets

styles/ - Tailwind and global styles

🌍 Deployment
Deploy instantly using Vercel:


📸 Screenshots
🖥️ Editor

📂 Note List

(Replace with your actual screenshots in the public/ folder for GitHub visuals)

🙋‍♂️ About the Developer
Built with ❤️ by Shams Ali.

GitHub

LinkedIn

📜 License
This project is licensed under the MIT License.
Feel free to use, fork, and build upon it.

⭐️ Contribute & Star
If you find this project helpful:

⭐️ Star the repository

🍴 Fork to contribute new features

🐞 Open issues for suggestions or bugs

📚 Learn More
Next.js Documentation

Firebase Documentation

CodeMirror Documentation

Tailwind CSS Documentation

🚀 Happy Coding with CodeExchanger!

yaml
Copy
Edit

---

### Instructions:
✅ **Copy and paste** the above into your `README.md` in your project root.  
✅ Replace the `git clone` URL and screenshot paths if needed.  
✅ Commit and push:

```bash
git add README.md
git commit -m "Add clean, complete README for CodeExchanger"
git push
Your GitHub project will now look professional and clear for sharing, showcasing, and deploying.# codeexchnager
