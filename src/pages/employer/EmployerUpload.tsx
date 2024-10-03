import React, { useState } from 'react';
import UploadPage from '../Candidate/UploadPage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface JobMatch {
  similarity: string;
  match_summary: string;
  Candidatenaame:string;

}

type UploadType = 'Job Description' | 'CV' | 'Interview Script';

const EmployerUpload: React.FC = () => {
  const navigate = useNavigate();
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [responceData, setResponceData] = useState<JobMatch[]>([]);
  //let responceData:JobMatch[] |any=[];



  const handleUpload = async (file: File, uploadType: UploadType) => {
    if (uploadType === 'CV') {
      setErrorMessage('Employers cannot upload CVs.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const endpoint = uploadType === 'Job Description' ? '/api/upload_job_description' : '/api/upload_interview_script';
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log(response);
        if (response.data) {
          setResponceData(JSON.parse(response.data));
          //responceData=response.data;
        }

        setUploadStatus('success');
        setErrorMessage(null);
        alert(`${uploadType} uploaded successfully!`);
      } else {
        setUploadStatus('error');
        setErrorMessage(`Failed to upload ${uploadType}. Please try again.`);
      }
    } catch (error) {
      setUploadStatus('error');
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setErrorMessage(`Error ${error.response.status}: ${error.response.data.error || 'Unknown error'}`);
        } else if (error.request) {
          setErrorMessage('No response received from server. Please try again later.');
        } else {
          setErrorMessage('An error occurred while setting up the request.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      console.error('Upload error:', error);
    }
  };


  const JobCard: React.FC<{ job: JobMatch }> = ({ job }) => (
    <div className="flex flex-col gap-6 p-6 w-full bg-white rounded-2xl shadow-md border border-gray-200 mb-6">
    {/* Heading for Top 2 Candidates */}
    <div className="w-full mb-4">
      <h1 className="text-2xl font-bold tracking-tight leading-relaxed text-indigo-900">
        Top 2 Candidates
      </h1>
    </div>
  
    {/* Header Section */}
    <div className="flex flex-wrap justify-between items-center w-full gap-10 max-md:flex-col">
      
      {/* Candidate Name (Left Side) */}
      <div className="flex flex-col w-full md:w-auto mt-6">
        <h2 className="text-xl font-semibold tracking-tight leading-relaxed text-indigo-900">
          {job.Candidatenaame}
        </h2>
      </div>
  
      {/* Similarity Score (Right Side) */}
      <div className="flex flex-col justify-center items-center text-center text-indigo-900 rounded-lg border border-indigo-900 px-5 py-4 shadow-sm min-h-[66px] w-[174px]">
        <div className="text-2xl font-bold">{job.similarity}</div>
        <div className="mt-2 text-sm font-medium">Similarity Score</div>
      </div>
    </div>
  
    {/* Personalized Description Section */}
    <div className="flex flex-col mt-6 p-5 bg-gray-50 rounded-lg border border-gray-300">
      <div className="text-lg font-medium text-gray-900">Personalized Description</div>
      <div className="mt-4 space-y-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
        {job.match_summary}
      </div>
    </div>
  </div>
  
  
  

  );

  return (
    <>
      <UploadPage userType="employer" onUpload={handleUpload} />
      {uploadStatus === 'success' && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          File uploaded successfully!
        </div>
      )}
      {uploadStatus === 'error' && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {errorMessage || 'Failed to upload file. Please try again.'}
        </div>
      )}


      <div className="flex gap-6 items-center p-6">
        <div className="flex flex-col flex-1 shrink self-stretch my-auto w-full basis-0 min-w-[240px] max-md:max-w-full">
          {responceData.length > 0 ? (
            responceData.map((job: any, index: any) => (
              <JobCard
                key={index}
                job={job}
              />
            ))
          ) : (
            <div className="text-center">No job matches found.</div>
          )}
        </div>
      </div>

    </>




  );
};

export default EmployerUpload;