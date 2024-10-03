import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  similarityScore: string;
  personalized_description:string;
}



const JobCard: React.FC<{ job: JobMatch, actualId: number }> = ({ job, actualId }) => (
  <div className="flex flex-col gap-6 p-6 w-full bg-white rounded-2xl shadow-md border border-gray-200 mb-6">
  <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:flex-col">
    {/* Job Title and Company Info */}
    <div className="flex gap-4 items-center min-w-[260px]">
      <div className="flex flex-col">
        <div className="flex gap-2 justify-start items-start">
          <div className="flex flex-col">
            <div className="text-xl font-semibold text-gray-900 leading-snug">{job.title}</div>
            <div className="text-md text-gray-600">{job.company}</div>
          </div>
        </div>
        <div className="flex gap-4 items-center mt-3 text-sm text-gray-500">
          {/* Location */}
          <div className="flex items-center gap-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/d4888f631ba56a7b45cf7d55093b50fe98328c3dab3907f491377eb5d6f9a217?apiKey=e8521392b64d4ca28efa899b1eeac3c3"
              className="w-6 h-6"
              alt="Location icon"
            />
            <div>{job.location}</div>
          </div>
          {/* Salary */}
          <div className="flex items-center gap-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/606ae7adcae62e76ed3a227305894cce6edacde4c70b8df60335bc40fac6c4f4?apiKey=e8521392b64d4ca28efa899b1eeac3c3"
              className="w-5 h-5"
              alt="Salary icon"
            />
            <div>{job.salary}</div>
          </div>
        </div>
      </div>
    </div>

    {/* Similarity Score */}
    <div className="flex flex-col justify-center text-center text-indigo-900 rounded-lg border border-indigo-900 px-5 py-4 shadow-sm min-h-[66px] w-[174px]">
      <div className="text-2xl font-bold">{job.similarityScore}</div>
      <div className="mt-2 text-sm font-medium">Similarity Score</div>
    </div>
  </div>

  {/* Personalized Description Section */}
  <div className="flex flex-col mt-6 p-5 bg-gray-50 rounded-lg border border-gray-300">
    <div className="text-lg font-medium text-gray-900">Personalized Description</div>
    <div className="mt-4 space-y-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
      {job.personalized_description}
    </div>
  </div>

  {/* View Details Button */}
  <div className="flex justify-end mt-8">
    <Link
      to={`/candidate/jobs/${actualId}`} 
      className="px-4 py-2 bg-indigo-900 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 ease-in-out"
    >
      View Details
    </Link>
  </div>
</div>

);

// const JobsPage: React.FC = () => {
//   const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchJobMatches = async () => {
//       try {
//         const response = await axios.get<JobMatch[]>('http://localhost:5000/api/job_matches');
//         setJobMatches(response.data);
//         setIsLoading(false);
//       } catch (err) {
//         setError('Failed to fetch job matches. Please try again later.');
//         setIsLoading(false);
//       }
//     };

//     fetchJobMatches();
//   }, []);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="flex gap-6 items-center p-6">
//       <div className="flex flex-col flex-1 shrink self-stretch my-auto w-full basis-0 min-w-[240px] max-md:max-w-full">
//         {jobMatches.map((job) => (
//           <JobCard key={job.id} job={job} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default JobsPage;

const JobsPage: React.FC = () => {
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [availableIds, setAvailableIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [matchesResponse, idsResponse] = await Promise.all([
          axios.get<JobMatch[]>('http://localhost:5000/api/job_matches'),
          axios.get<{ job_ids: number[] }>('http://localhost:5000/api/available_job_ids')
        ]);

        console.log('Job matches:', matchesResponse.data);
        console.log('Available IDs:', idsResponse.data.job_ids);

        setJobMatches(matchesResponse.data);
        setAvailableIds(idsResponse.data.job_ids);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch job data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="flex gap-6 items-center p-6">
      <div className="flex flex-col flex-1 shrink self-stretch my-auto w-full basis-0 min-w-[240px] max-md:max-w-full">
        {jobMatches.length > 0 ? (
          jobMatches.map((job, index) => (
            <JobCard 
              key={job.id} 
              job={job} 
              actualId={availableIds[index] || parseInt(job.id)}
            />
          ))
        ) : (
          <div className="text-center">No job matches found.</div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;