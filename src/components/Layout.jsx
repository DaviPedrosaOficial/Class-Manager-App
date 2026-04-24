import Navbar from "./Navbar";

function Layout({ children }) {
    return (
        <>
            <Navbar />
            <div className="container mt-5">
                {children}
            </div>
        </>
    );
}

export default Layout;