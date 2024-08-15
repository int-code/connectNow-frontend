"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageLoader from '../../components/PageLoader';
import AppFooter from '../../components/AppFooter';
import ComponentHeader from '../../components/ComponentHeader';
import ProjectCard from '../../components/ProjectCard';


interface Project {
  description: string | null;
  admin_id: number;
  id: number;
  pic_url: string;
  status: string;
  name: string;
  pic_path: string;
  created_at: string; // Consider using Date type if you need to work with date objects
}

interface ProjectsData {
  owned: Project[];
  member: Project[];
}
interface User{
  bio: string;
  email: string;
  isUser: boolean;
  name: string;
  profile_pic: string;
  username: string;
  joined_at: string;
}

interface Skill{
  id: number;
  skill: string;
}

interface UserSkills{
  skills: Skill[];
}

const ProjectPage: React.FC = () => {
  const { user_id } = useParams();
  console.log(user_id);
  const [userData, setUserData] = useState<User | null>(null);
  const [userProject, setUserProject] = useState<ProjectsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userSkillData, setUserSkillData] = useState<UserSkills | null>(null);

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
    const fetchData = async () => {
      if (!user_id) return;

      const accessToken = sessionStorage.getItem("access_token");

      try {
        // Fetch user data
        let response = await fetch(`http://152.42.222.73/api/connectnow/user/${user_id}`, {
          headers: {
            "access-token": accessToken || '',
          },
        });
        if (response.status === 401) {
          // Handle token refresh
          const refreshToken = sessionStorage.getItem("refresh_token");
          if (refreshToken) {
            const refreshResponse = await fetch(`http://152.42.222.73/api/connectnow/auth/refresh/?refresh_token=${refreshToken}`, {
              method: "POST",
            });

            if (!refreshResponse.ok) throw new Error('Failed to refresh token');

            const refreshData = await refreshResponse.json();
            sessionStorage.setItem("access_token", refreshData.access_token);

            // Retry fetching user data
            response = await fetch(`http://152.42.222.73/api/connectnow/user/${user_id}`, {
              headers: {
                "access-token": refreshData.access_token,
              },
            });
          }
        }

        const userData = await response.json();
        if (!userData.detail) {
          setUserData(userData);
        }

        // Fetch user projects
        response = await fetch(`http://152.42.222.73/api/connectnow/project/user/${user_id}`, {
          headers: {
            "access-token": sessionStorage.getItem("access_token") || '',
          },
        });
        if (response.status === 401) {
          // Handle token refresh again if needed
          const refreshToken = sessionStorage.getItem("refresh_token");
          if (refreshToken) {
            const refreshResponse = await fetch(`http://152.42.222.73/api/connectnow/auth/refresh/?refresh_token=${refreshToken}`, {
              method: "POST",
            });

            if (!refreshResponse.ok) throw new Error('Failed to refresh token');

            const refreshData = await refreshResponse.json();
            sessionStorage.setItem("access_token", refreshData.access_token);

            // Retry fetching user projects
            response = await fetch(`http://152.42.222.73/api/connectnow/project/user/${user_id}`, {
              headers: {
                "access-token": refreshData.access_token,
              },
            });
          }
        }

        const userProjectsData = await response.json();
        if (!userProjectsData.detail) {
          setUserProject(userProjectsData);
        }
        response = await fetch(`http://152.42.222.73/api/connectnow/skill/user/${user_id}`, {
          headers: {
            "access-token": accessToken || '',
          },
        });
        if (response.status === 401) {
          // Handle token refresh
          const refreshToken = sessionStorage.getItem("refresh_token");
          if (refreshToken) {
            const refreshResponse = await fetch(`http://152.42.222.73/api/connectnow/auth/refresh/?refresh_token=${refreshToken}`, {
              method: "POST",
            });

            if (!refreshResponse.ok) throw new Error('Failed to refresh token');

            const refreshData = await refreshResponse.json();
            sessionStorage.setItem("access_token", refreshData.access_token);

            // Retry fetching user data
            response = await fetch(`http://152.42.222.73/api/connectnow/skill/user/${user_id}`, {
              headers: {
                "access-token": refreshData.access_token,
              },
            });
          }
        }

        const userSkillData = await response.json();
        if (!userSkillData.detail) {
          setUserSkillData(userSkillData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user_id]);


  if (loading) return <PageLoader />;
  if (!userData) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="text-center p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg">
        <div className='flex w-full justify-center items-center'> 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-40 h-40 fill-slate-900">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">User Not Found</h1>
        <p className="text-lg text-gray-700 mb-6">Sorry, the User you are looking for does not exist or has been removed.</p>
        <a href="/dashboard" className="inline-block px-6 py-3 bg-slate-900 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-300">Back to Dashboard</a>
      </div>
    </div>
  );

  return (
    <div>
      <div className='pt-24 min-h-screen bg-slate-800 text-white'>
        <div className='p-10'>
          <div className='grid grid-cols-4 w-full justify-center items-center gap-4'>
            <div className='rounded-full'>
              <img src={userData.profile_pic} className='object-cover rounded-full w-48 h-48'/>
            </div>
            <div className='col-span-3'>
              <div className='text-5xl font-bold'>
                {userData.name}
              </div>
              <div className='text-2xl pl-1'>
                @{userData.username}
              </div>
              <div className='pt-6'>
                Joined: {formatDateTimeToUserTimezone(userData.joined_at)}
              </div>
              <div className='pt-20'>
                <div dangerouslySetInnerHTML={{ __html: (userData.bio || '').replace(/\n/g, '<br>') }}></div>
              </div>
            </div>
          </div>
          
          <div className='mt-20 ml-20 text-lg'>
          </div>
          <div className='mt-20 text-lg'>
            {userSkillData && userSkillData.skills && userSkillData.skills.map((skill) => (
                <div key={skill.id} className='cursor-pointer rounded-full shadow-lg px-4 py-2 text-center flex items-center justify-center border-2 border-slate-900 hover:bg-slate-900 hover:text-white'>
                  {skill.skill}
                </div>
              ))}
          </div>
        </div>
        <div className='col-span-4 bg-slate-900 p-8 rounded-lg shadow-slate-900  shadow-xl'>
          <div className='text-5xl'>
            Projects:
          </div>
          <div className='py-10'>
            <div className='text-3xl '>
              Owned Projects:
            </div>
              <div className='grid grid-cols-5 gap-4 pt-4'>
                { userProject?.owned ? (
                userProject?.owned.map((project)=>(
                  <ProjectCard key={project.id} projectId={project.id} img={project.pic_url} name={project.name} description={project.description || ""} />
                ))):
                (
                  <p>No owned projects available.</p>
                )}
              </div>
          </div>
          <div className='py-10'>
            <div className='text-3xl '>
              Member Projects:
            </div>
              <div className='grid grid-cols-5 gap-4 pt-4'>
                {userProject?.member.map((project)=>(
                  <ProjectCard key={project.id} projectId={project.id} img={project.pic_url} name={project.name} description={project.description || ""} />
                ))}
              </div>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
};

export default ProjectPage;
