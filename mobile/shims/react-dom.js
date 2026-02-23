// Minimal react-dom mock for React Native environments
// Clerk's clerk-react imports react-dom for web portals, which don't exist in RN
// This shim prevents the bundler from failing while keeping all Clerk auth hooks working

const ReactDOM = {
    createPortal: (children) => children,
    render: () => { },
    unmountComponentAtNode: () => { },
    findDOMNode: () => null,
    flushSync: (fn) => fn(),
};

module.exports = ReactDOM;
module.exports.default = ReactDOM;
