import SetUpForm from "../../components/SetUpForm/SetUpForm";
import SetUpPhotos from "../../components/SetUpPhotos/SetUpPhotos";
import "./SetUpAccount.scss";
import { useState } from "react";


const SetUpAccount: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="setUp_account">
     
    {currentStep === 2 && <SetUpForm onNext={handleNext} />}
      {currentStep === 1 && <SetUpPhotos />}
    </div>
  );
};

export default SetUpAccount;
