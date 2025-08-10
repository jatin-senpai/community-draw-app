export function Authpage({isSignin}:{
    isSignin: boolean;
}) {
    return (
        <div>
            <input type="text" placeholder="Email"/>
            <input type="text" placeholder="Password" />
        </div>
    )
}