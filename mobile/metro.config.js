const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Intercept module resolution at ALL levels (including inside node_modules).
// 1) react-dom → shim: @clerk/clerk-react imports react-dom for web portals (not needed in RN)
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'react-dom' || moduleName.startsWith('react-dom/')) {
        return {
            filePath: path.resolve(__dirname, 'shims/react-dom.js'),
            type: 'sourceFile',
        };
    }
    // Default resolution
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
