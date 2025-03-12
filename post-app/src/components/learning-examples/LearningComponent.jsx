import FirstComponent, { FifthComponent } from "./FirstComponent";
import SecondComponent from "./SecondComponent";
import FourthComponent from "./FourthComponent";
import ThirdComponent from "./ThirdComponent";
import LearningJavaScript from "./LearningJavaScript";

export default function LearningComponent() {
   return(
    <div className="LearningComponent">
        <FirstComponent/>
        <SecondComponent/>
        <ThirdComponent/>
        <FourthComponent/>
        <FifthComponent/>
        <LearningJavaScript/>
    </div>
   ) 
}