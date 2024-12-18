import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { PasswordInput } from "../components/PasswordInput";
import { SubHeading } from "../components/SubHeading";

export const Signin = () => {
    return <div>
        <div className="flex justify-center bg-slate-300 h-screen">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign In"}/>
                    <SubHeading label={"Enter your credentials to acces your account"}/>
                    <InputBox placeholder={"jogn.doe@gmail.com"} label={"Email"}/>
                    <PasswordInput placeholder="*******" label={"Password"}/>
                    <div className="pt-4">
                        <Button label={"Sign In"}/>
                    </div>
                    <BottomWarning label={"Don't have an account?"} buttonText={"Sign Up"} to={"/signup"}/>
                </div>
            </div>
        </div>
    </div>
}