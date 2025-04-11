# 🧠 CleanTabz

A smart Chrome extension that helps you manage your browser tabs by suggesting to close unused ones. Keep your browser clean and optimized with minimal effort!

## 🌟 Features

- 🕒 Set custom time intervals for tab cleanup
- 📊 Smart tab usage tracking
- 🔔 Gentle notifications with sound alerts
- ⏱️ Auto-close countdown
- 🎯 Preset time options (30min, 1h, 2h, 3h)
- 🎨 Modern, clean UI with TailwindCSS

## 🚀 Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/CleanTabz.git
```

2. Open Chrome and go to `chrome://extensions/`

3. Enable "Developer mode" in the top right

4. Click "Load unpacked" and select the CleanTabz folder

## 💡 How to Use

1. Click the CleanTabz icon in your Chrome toolbar
2. Set your preferred check interval:
   - Enter a custom time (in minutes or hours)
   - Or select from preset options
3. Click "Apply"
4. CleanTabz will automatically:
   - Track your tab usage
   - Suggest closing unused tabs
   - Show notifications when it's time to clean up

## 🔧 Customization

- Adjust the check interval anytime from the popup
- Choose between minutes or hours
- Use preset options for quick setup
- Customize notification settings

## 🛠️ Development

### Project Structure
```
CleanTabz/
├── icons/               # Extension icons
├── sounds/             # Notification sounds
├── popup.html          # Main UI
├── popup.js            # UI logic
├── background.js       # Core functionality
├── noti.html           # Notification UI
├── noti.js             # Notification logic
└── manifest.json       # Extension config
```

### Building
No build step required! Just load the extension directly in Chrome.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by the need for better tab management
- Built with Chrome Extension APIs and TailwindCSS 