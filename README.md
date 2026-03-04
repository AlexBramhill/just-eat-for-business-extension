# Unofficial Just Eat for Business Chrome Extension

A Chrome extension that adds buttons to Just Eat for Business

## Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AlexBramhill/just-eat-for-business-extension.git
   cd just-eat-for-business-extension
   ```

1. **Install dependencies:**

   ```bash
   npm install
   ```

1. **Build the extension:**

   Live rebuild:

   ```bash
   npm run dev
   ```

   or

   Static build:

   ```bash
   npm run build
   ```

   This will create a `dist` folder with the packed extension files. `dev` mode has live reloading to the build folder (
   note: extension still requires being reloaded in Chrome based on Chrome's requirements)

1. **Load the extension in Chrome:**
    - Navigate to `chrome://extensions`.
    - Enable **Developer mode** using the toggle in the top-right corner.
    - Click the **Load unpacked** button.
    - Select the `dist` directory from this project.
