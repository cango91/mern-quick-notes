import { logout } from "../../utilities/users-service";
export default function NavBar({user, setUser}){
    async function handleLogout(){
        await logout();
        setUser(null);
        // force re-render
        window.location.href = window.location.href;
    }
    function goToNotes(){
        window.location.href = '/notes';
    }
    return (
        <div>
            {user ? 
            <>
            Welcome, {user.name} <br />
            <button onClick={goToNotes}>Notes</button>
            <button onClick={handleLogout}>Logout</button>
            </>
            :
            '' 
        }
        </div>
    );
}