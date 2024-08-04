"use client";
// src/app/projectMain/[projectId]/page.tsx
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageLoader from '@/app/components/PageLoader';
import AppFooter from '@/app/components/AppFooter';
import ComponentHeader from '@/app/components/ComponentHeader';

interface Project {
  id: number;
  admin_id: number;
  name: string;
  description: string;
  pic_url: string;
  pic_path: string;
  status: string;
  created_at: string;
}

interface Member {
  id: number;
  email: string;
  profile_pic: string | null;
  profile_pic_path: string | null;
  created_at: string;
  bio: string | null;
  name: string | null;
  password: string;
  username: string;
}

interface Interest {
  id: number;
  email: string;
  profile_pic: string | null;
  profile_pic_path: string | null;
  created_at: string;
  bio: string | null;
  name: string | null;
  password: string;
  username: string;
}

interface Skill {
  id: number;
  name: string;
}

interface Owner {
  id: number;
  email: string;
  profile_pic: string;
  profile_pic_path: string;
  created_at: string;
  bio: string;
  password: string;
  name: string;
  username: string;
}

interface ProjectData {
  project: Project;
  members: Member[];
  interests: Interest[];
  isMember: string;
  skills: Skill[];
  owner: Owner;
  admins: Member[];
}

const ProjectPage: React.FC = () => {
  const { project_id } = useParams();
  console.log(project_id);
  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  function getUserTimezone() {
    const options: Intl.DateTimeFormatOptions = { timeZoneName: 'short' };
    const formatter = new Intl.DateTimeFormat(undefined, options);
    const parts = formatter.formatToParts(new Date());
    const timeZonePart = parts.find(part => part.type === 'timeZoneName');
    const timeZoneName = timeZonePart ? timeZonePart.value : 'Unknown timezone';
    const resolvedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return { timeZoneName, resolvedTimeZone };
  }
  
  function formatDateTimeToUserTimezone(datetimeString: string): string {
    const { timeZoneName, resolvedTimeZone } = getUserTimezone();
    
    // Parse the UTC date string
    const utcDate = new Date(datetimeString + 'Z'); // Append 'Z' to ensure UTC interpretation
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: resolvedTimeZone,
    };
  
    const formattedDate = new Intl.DateTimeFormat(undefined, options).format(utcDate);
    return `${formattedDate} (${timeZoneName})`;
  }
  
  
  
  useEffect(() => {
    if (project_id) {
      fetch(`http://127.0.0.1:8000/project/${project_id}`, {
        headers: {
          "access-token": `${sessionStorage.getItem("access_token")}`,
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if(!data.detail){
            setData(data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching project:', error);
          setLoading(false);
        });
    }
  }, [project_id]);

  if (loading) return <PageLoader />;
  if (!data) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg">
        <div className='flex w-full justify-center items-center'> 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-40 h-40 fill-slate-900">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
        <p className="text-lg text-gray-700 mb-6">Sorry, the project you are looking for does not exist or has been removed.</p>
        <a href="/dashboard" className="inline-block px-6 py-3 bg-slate-900 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-300">Back to Dashboard</a>
      </div>
    </div>
  );

  return (
    <div>
      <ComponentHeader isLoggedIn={true} route={'/projectMain'} />
      <div className='pt-16 grid grid-cols-12 gap-8 min-h-screen'>
        <div className='col-span-8'>
          <div className='w-full h-72 p-10'>
            <img src={data.project.pic_url} className='cursor-pointer w-full h-full object-cover rounded-lg shadow-md' />
          </div>
          <div className='text-5xl font-bold px-10 pt-10'>{data.project.name}</div>
          <div className='px-10 pb-10 pt-4 text-gray-600'>Created at: {formatDateTimeToUserTimezone(data.project.created_at)}</div>
          <div className='px-10 text-lg text-gray-800' dangerouslySetInnerHTML={{ __html: (data.project.description || '').replace(/\n/g, '<br>') }}></div>
          <div className='flex flex-wrap p-10 gap-2'>
            {data.skills.map((skill) => (
              <div key={skill.id} className='cursor-pointer rounded-full shadow-lg px-4 py-2 text-center flex items-center justify-center border-2 border-slate-900 hover:bg-slate-900 hover:text-white'>
                {skill.name}
              </div>
            ))}
          </div>
        </div>
        <div className='col-span-4 bg-white p-6 rounded-lg shadow-slate-900  shadow-xl'>
          <h2 className="text-2xl font-bold mb-4 mt-10">Project Details</h2>
          <div className='mb-4'>
            <p className='text-gray-600'>Owner:</p>
            <div className='flex items-center mt-2 cursor-pointer' onClick={(event: React.MouseEvent<HTMLDivElement>)=>{window.location.href=`http://localhost:3000/userMain/${data.owner.id}`;}}>
              <img src={data.owner.profile_pic} alt={`Profile of ${data.owner.username}`} className='rounded-full w-8 h-8 mr-2'/>
              <p className='font-bold'>@{data.owner.username}</p>
            </div>
          </div>
          <div className='mb-4'>
            <p className='text-gray-600'>Admins:</p>
            <div className='flex flex-wrap gap-2 mt-2'>
              {data.admins && data.admins.map((admin) => (
                <div key={admin.id} className='flex items-center cursor-pointer' onClick={(event: React.MouseEvent<HTMLDivElement>)=>{window.location.href=`http://localhost:3000/userMain/${admin.id}`;}}>
                  {admin.profile_pic && <img src={admin.profile_pic} alt={`Profile of ${admin.username}`} className='rounded-full w-8 h-8 mr-2' />}
                  <p className='font-bold'>@{admin.username}</p>
                </div>
              ))}
            </div>
          </div>
          <div className='mb-4'>
            <p className='text-gray-600'>Members:</p>
            <div className='flex flex-wrap gap-2 mt-2'>
              {data.members && data.members.map((member) => (
                <div key={member.id} className='flex items-center cursor-pointer' onClick={(event: React.MouseEvent<HTMLDivElement>)=>{window.location.href=`http://localhost:3000/userMain/${member.id}`;}}>
                  {member.profile_pic && <img src={member.profile_pic} alt={`Profile of ${member.username}`} className='rounded-full w-8 h-8 mr-2' />}
                  <p className='font-bold'>@{member.username}</p>
                </div>
              ))}
            </div>
          </div>
          <hr className='border-gray-300 my-4' />
          <div>
            <p className='text-gray-600'>Interests:</p>
            <p className='font-bold mt-2'>{data.interests.length > 0 ? (
              <span className='cursor-pointer hover:underline'>
                {data.interests.length} {data.interests.length === 1 ? 'person' : 'people'} interested
              </span>
            ) : 'No interests yet'}</p>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
};

export default ProjectPage;
