import React, { useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import axios from 'axios';

const ExpatWallet = () => {
  const [steps, setSteps] = useState([
    // Steps data as defined in your original code
    {
      id: 1,
      title: "Obtain Employment Contract",
      vcs: [
        {
          id: 1,
          title: "Employment Offer Letter",
          obtainedFrom: "Employer",
          inputs: [
            { name: "firstname", type: "text", placeholder: "First Name" },
            { name: "lastname", type: "text", placeholder: "Last Name" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "position", type: "text", placeholder: "Position" },
            { name: "phonenumber", type: "number", placeholder: "Phone Number" },
          ],
        },
      ],
      completed: false,
    },
    {
      id: 2,
      title: "Apply for Visa",
      vcs: [
        {
          id: 2,
          title: "Proof of Identity",
          obtainedFrom: "Immigration Authority",
          inputs: [
            { name: "firstname", type: "text", placeholder: "First Name" },
            { name: "lastname", type: "text", placeholder: "Last Name" },
            { name: "dateofbirth", type: "string", placeholder: "Date of Birth" },
            { name: "address", type: "text", placeholder: "Address" },
            { name: "phonenumber", type: "number", placeholder: "Phone Number" },
            { name: "fathername", type: "text", placeholder: "Father's Name" },
            { name: "mothername", type: "text", placeholder: "Mother's Name" },
            { name: "nationality", type: "text", placeholder: "Nationality" },

          ],
        },
        { id: 3, title: "Employment Contract", obtainedFrom: "Employer",
          inputs: [
            { name: "nameofthecompany", type: "text", placeholder: "Name of Company" },
            { name: "nameoftheemployee", type: "text", placeholder: "Name of Employee" },
            { name: "position", type: "text", placeholder: "Position" },
            { name: "dateofjoining", type: "string", placeholder: "Date of Joining " },
            { name: "phonenumber", type: "number", placeholder: "Phone Number" },
            { name: "email", type: "email", placeholder: "Email " },
            { name: "salary", type: "string", placeholder: "Salary" },
            { name: "placeofwork", type: "text", placeholder: "Place of Work" },

          ],
         },
        {
          id: 4,
          title: "Proof of Financial Stability",
          obtainedFrom: "Immigration Authority",
          inputs: [
            { name: "jobTitle", type: "text", placeholder: "Job Title" },
            { name: "salary", type: "number", placeholder: "Salary" },
          ],
        },
      ],
      completed: false,
    },
    {
      id: 3,
      title: "Register with Municipality",
      vcs: [
        { id: 5, title: "Employment Contract", obtainedFrom: "Employer",
          inputs: [
            { name: "nameofthecompany", type: "text", placeholder: "Name of Company" },
            { name: "nameoftheemployee", type: "text", placeholder: "Name of Employee" },
            { name: "position", type: "text", placeholder: "Position" },
            { name: "dateofjoining", type: "string", placeholder: "Date of Joining " },
            { name: "phonenumber", type: "number", placeholder: "Phone Number" },
            { name: "email", type: "email", placeholder: "Email " },
            { name: "salary", type: "string", placeholder: "Salary" },
            { name: "placeofwork", type: "text", placeholder: "Place of Work" },
          ],
         },
        {
          id: 6,
          title: "Proof of Identity",
          obtainedFrom: "Immigration Authority",
          inputs: [
            { name: "firstname", type: "text", placeholder: "First Name" },
            { name: "lastname", type: "text", placeholder: "Last Name" },
            { name: "dateofbirth", type: "string", placeholder: "Date of Birth" },
            { name: "address", type: "text", placeholder: "Address" },
            { name: "phonenumber", type: "number", placeholder: "Phone Number" },
            { name: "fathername", type: "text", placeholder: "Father's Name" },
            { name: "mothername", type: "text", placeholder: "Mother's Name" },
            { name: "nationality", type: "text", placeholder: "Nationality" },
          ],
        },
        { id: 7, title: "Birth Certificate", obtainedFrom: "Municipality",
          inputs: [
            { name: "certificateId", type: "string", placeholder: "Certificate ID" },
            { name: "firstname", type: "text", placeholder: "First Name" },
            { name: "lastname", type: "text", placeholder: "Last Name" },
            { name: "dateofbirth", type: "string", placeholder: "Date of Birth" },
            { name: "placeofbirth", type: "string", placeholder: "Place of Birth" },
            { name: "fathername", type: "text", placeholder: "Father's Name" },
            { name: "dateofissue", type: "string", placeholder: "Date of Issue" },

          ],
         },
      ],
      completed: false,
    },
    {
      id: 4,
      title: "Open Bank Account",
      vcs: [
        { id: 8, title: "Proof of Registration", obtainedFrom: "Municipality",
          inputs: [
            { name: "jobTitle", type: "text", placeholder: "Job Title" },
            { name: "salary", type: "number", placeholder: "Salary" },
          ],
         },
        { id: 9, title: "Employment Contract", obtainedFrom: "Employer",
          inputs: [
            { name: "nameofthecompany", type: "text", placeholder: "Name of Company" },
            { name: "nameoftheemployee", type: "text", placeholder: "Name of Employee" },
            { name: "position", type: "text", placeholder: "Position" },
            { name: "dateofjoining", type: "string", placeholder: "Date of Joining " },
            { name: "phonenumber", type: "number", placeholder: "Phone Number" },
            { name: "email", type: "email", placeholder: "Email " },
            { name: "salary", type: "string", placeholder: "Salary" },
            { name: "placeofwork", type: "text", placeholder: "Place of Work" },
          ],
         },
        {
          id: 10,
          title: "Proof of Identity",
          obtainedFrom: "Immigration Authority",
          inputs: [
            { name: "firstname", type: "text", placeholder: "First Name" },
            { name: "lastname", type: "text", placeholder: "Last Name" },
            { name: "dateofbirth", type: "string", placeholder: "Date of Birth" },
            { name: "address", type: "text", placeholder: "Address" },
            { name: "phonenumber", type: "number", placeholder: "Phone Number" },
            { name: "fathername", type: "text", placeholder: "Father's Name" },
            { name: "mothername", type: "text", placeholder: "Mother's Name" },
            { name: "nationality", type: "text", placeholder: "Nationality" },
          ],
        },
      ],
      completed: false,
    },
    {
      id: 5,
      title: "Secure Housing and Sign Rental Agreement",
      vcs: [
        { id: 11, title: "Employment Contract", obtainedFrom: "Employer",
          inputs: [
            { name: "nameofthecompany", type: "text", placeholder: "Name of Company" },
            { name: "nameoftheemployee", type: "text", placeholder: "Name of Employee" },
            { name: "position", type: "text", placeholder: "Position" },
            { name: "dateofjoining", type: "string", placeholder: "Date of Joining " },
            { name: "phonenumber", type: "number", placeholder: "Phone Number" },
            { name: "email", type: "email", placeholder: "Email " },
            { name: "salary", type: "string", placeholder: "Salary" },
            { name: "placeofwork", type: "text", placeholder: "Place of Work" },
          ],
         },
        {
          id: 12,
          title: "Proof of Identity",
          obtainedFrom: "Immigration Authority",
          inputs: [
            { name: "firstname", type: "text", placeholder: "First Name" },
            { name: "lastname", type: "text", placeholder: "Last Name" },
            { name: "dateofbirth", type: "string", placeholder: "Date of Birth" },
            { name: "address", type: "text", placeholder: "Address" },
            { name: "phonenumber", type: "number", placeholder: "Phone Number" },
            { name: "fathername", type: "text", placeholder: "Father's Name" },
            { name: "mothername", type: "text", placeholder: "Mother's Name" },
            { name: "nationality", type: "text", placeholder: "Nationality" },
          ],
        },
        { id: 13, title: "Bank Account Details", obtainedFrom: "Bank",
          inputs: [
            { name: "name", type: "string", placeholder: "Name" },
            { name: "account_number", type: "string", placeholder: "Account Number" },
            { name: "bank_name", type: "string", placeholder: "Bank Name" },
            { name: "branch_name", type: "string", placeholder: "Branch Name" },
            { name: "ifsc_code", type: "number", placeholder: "IFSC Code" },
            { name: "fathername", type: "text", placeholder: "Father's Name" },
            { name: "mothername", type: "text", placeholder: "Mother's Name" },
            { name: "nationality", type: "text", placeholder: "Nationality" },
          ],
         },
        
      ],
      completed: false,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false); 
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    position: '',
    phone: ''
  });
  const [selectedVC, setSelectedVC] = useState(null);

  const vcHandlers = {
    // vcHandlers as defined in your original code
      // Step 1 handler
      1: async ()=> {
        try {
          const response = await axios.post('http://localhost:4081/api/employment_offer');
          if (response.status === 200) {
            console.log('Employment offer letter processed successfully');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
    
      // Step 2 handlers
      2: async () => {
        try {
          const response = await axios.post('/api/proof-identity', {}, {
            headers: { 'Accept': 'text/plain' }
          });
          console.log('Proof of Identity processed');
        } catch (error) {
          console.error('Error:', error);
        }
      },
      3: async () => {
        try {
          const response = await axios.post('/api/employment-contract', {}, {
            headers: { 'Accept': 'text/plain' }
          });
          console.log('Employment Contract processed');
        } catch (error) {
          console.error('Error:', error);
        }
      },
      4: async () => {
        try {
          const response = await axios.post('/api/financial-stability', {}, {
            headers: { 'Accept': 'text/plain' }
          });
          console.log('Financial Stability proof processed');
        } catch (error) {
          console.error('Error:', error);
        }
      },
    
      // Step 3 handlers
      5: async () => {
        try {
          const response = await axios.post('/api/employment-contract-municipality', {}, {
            headers: { 'Accept': 'text/plain' }
          });
          console.log('Employment Contract for Municipality processed');
        } catch (error) {
          console.error('Error:', error);
        }
      },
      6: async () => {
        try {
          const response = await axios.post('/api/proof-identity-municipality', {}, {
            headers: { 'Accept': 'text/plain' }
          });
          console.log('Proof of Identity for Municipality processed');
        } catch (error) {
          console.error('Error:', error);
        }
      },
      7: async () => {
        try {
          const response = await axios.post('/api/birth-certificate', {}, {
            headers: { 'Accept': 'text/plain' }
          });
          console.log('Birth Certificate processed');
        } catch (error) {
          console.error('Error:', error);
        }
      },
    
      // Step 4 handlers
      8: async () => {
        try {
          const response = await axios.post('/api/proof-registration', {}, {
            headers: { 'Accept': 'text/plain' }
          });
          console.log('Proof of Registration processed');
        } catch (error) {
          console.error('Error:', error);
        }
      },
      9: async () => {
        try {
          const response = await axios.post('/api/employment-contract-bank', {}, {
            headers: { 'Accept': 'text/plain' }
          });
          console.log('Employment Contract for Bank processed');
        } catch (error) {
          console.error('Error:', error);
        }
      },
      10: async () => {
        try {
          const response = await axios.post('/api/proof-identity-bank', {}, {
            headers: { 'Accept': 'text/plain' }
          });
          console.log('Proof of Identity for Bank processed');
        } catch (error) {
          console.error('Error:', error);
        }
      },
    
      // Step 5 handlers
      11: async () => {
        try {
          const response = await axios.post('/api/employment-contract-housing', {}, {
            headers: { 'Accept': 'text/plain' }
          });
          console.log('Employment Contract for Housing processed');
        } catch (error) {
          console.error('Error:', error);
        }
      },
      12: async () => {
        try {
          const response = await axios.post('/api/proof-identity-housing', {}, {
            headers: { 'Accept': 'text/plain' }
          });
          console.log('Proof of Identity for Housing processed');
        } catch (error) {
          console.error('Error:', error);
        }
      },
      13: async () => {
        try {
          const response = await axios.post('/api/bank-account-details', {}, {
            headers: { 'Accept': 'text/plain' }
          });
          console.log('Bank Account Details processed');
        } catch (error) {
          console.error('Error:', error);
        }
      }
  };

  const updateVCStatus = (vcId, status) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => ({
        ...step,
        vcs: step.vcs.map((vc) =>
          vc.id === vcId ? { ...vc, obtained: status } : vc
        ),
      }))
    );

    setCompletedTasks((prevCompletedTasks) => {
      const updatedTasks = status
        ? [...prevCompletedTasks, vcId]
        : prevCompletedTasks.filter((id) => id !== vcId);
      updateStepCompletion(updatedTasks);
      return updatedTasks;
    });
  };

  const updateStepCompletion = (completedVCs) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => ({
        ...step,
        completed: step.vcs.every((vc) => completedVCs.includes(vc.id)),
      }))
    );
  };

  const toggleVC = (stepIndex, vcIndex) => {
    const vc = steps[stepIndex].vcs[vcIndex];
    updateVCStatus(vc.id, !completedTasks.includes(vc.id));
  };

  const obtainVC = async (stepIndex, vcIndex) => {
    const vc = steps[stepIndex].vcs[vcIndex];
    try {
      const handler = vcHandlers[vc.id];
      if (handler) {
        await handler();
        updateVCStatus(vc.id, true);
      } else {
        console.warn(`No handler found for VC ID: ${vc.id}`);
        updateVCStatus(vc.id, true);
      }
    } catch (error) {
      console.error(`Failed to obtain VC ${vc.title}:`, error);
    }
  };

    const calculateProgress = () => {
    const totalSteps = steps.length;
    const completedSteps = steps.filter((step) => step.completed).length;
    return (completedSteps / totalSteps) * 100;
  };

  const openModal = (vc, stepIndex, vcIndex) => {
    setSelectedVC({ vc, stepIndex, vcIndex });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      position: '',
      phone: ''
    });
    setSelectedVC(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleObtain = async () => {
    if (selectedVC) {
      await obtainVC(selectedVC.stepIndex, selectedVC.vcIndex);
    }
    closeModal();
  };

  return (
    <div className="flex h-screen absolute top-0 z-[-2] w-screen bg-neutral-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="w-1/2 p-8 animate-fade-in bg-red shadow-lg rounded-lg m-4 ">
        <h2 className="font-nunito text-4xl font-bold text-white mb-6">
          Miko's Journey
        </h2>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-500 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-pink-600 to-blue-600 rounded-full h-2 transition-all duration-300 ease-in-out"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <p className="text-sm text-white mt-2">
            {Math.round(calculateProgress())}% Complete
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex cursor-pointer items-center p-4 rounded-lg transition-all duration-200 transform ${
                step.completed ? "border-green-400" : "underline-effect bg-transparent"
              }`}
              onClick={() => setSelectedStep(step)}
            >
              <div className="flex items-center flex-1">
                {step.completed ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <Clock className="h-6 w-6 text-gray-400" />
                )}
                <span
                  className={`ml-4 text-lg font-semibold ${
                    step.completed
                      ? "line-through text-gray-300"
                      : "text-gray-400 "
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Verifiable Credentials */}
      <div className="w-1/2 p-8 bg-transparent shadow-lg rounded-lg m-4">
        <h2 className="font-nunito text-4xl font-bold text-white mb-6">
          Verifiable Credentials
        </h2>
        <div className="h-[calc(100vh-12rem)] overflow-y-auto pr-2 space-y-4 overflow-x-hidden">
          {selectedStep?.vcs.map((vc, index) => (
            <div
              key={vc.id}
              className={`p-4 rounded-lg shadow-md transition-colors duration-200 ${
                completedTasks.includes(vc.id)
                  ? "bg-transparent"
                  : "underline-effect bg-transparent"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-xl text-gray-300">
                  {vc.title}
                </h3>
                <div className="flex space-x-2 items-center">
                  {completedTasks.includes(vc.id) ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(vc, steps.findIndex((s) => s.id === selectedStep.id), index);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                      Fill Credentials
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-500 mt-2">
                Obtained from: {vc.obtainedFrom}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedVC && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="modal-wrapper">
    <div className="modal-content bg-black/20 backdrop-blur-md border border-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
      <h2 className="text-2xl text-white font-semibold mb-4 font-nunito">Enter Your Information</h2>
      <div className="space-y-4">
        {selectedVC.vc.inputs.map((input) => (
          <input
            key={input.name}
            type={input.type}
            name={input.name}
            value={formData[input.name] || ""}
            onChange={handleFormChange}
            placeholder={input.placeholder}
            className="w-full p-2 text-white bg-white/5 rounded-t border-b-2 border-gray-600 outline-none transition-all duration-150 focus:border-blue-500 focus:border-b-2"
          />
        ))}
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={closeModal}
          className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleObtain}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Obtain
        </button>
      </div>
    </div>
    </div>
    
  </div>
)}
    </div>
  );
};

export default ExpatWallet;
