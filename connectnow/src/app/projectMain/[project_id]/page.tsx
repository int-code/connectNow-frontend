"use client";
// src/app/projectMain/[projectId]/page.tsx
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageLoader from '@/app/components/PageLoader';
import AppFooter from '@/app/components/AppFooter';
import ComponentHeader from '@/app/components/ComponentHeader';
import { Button, Label, Modal, Textarea, TextInput, FileInput, Tabs } from 'flowbite-react';


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
  hasInterest: boolean;
}

interface Settings {
  projectName: string;
  projectDesc: string | null;
  projectPicUrl: string | null;
  projectPic: File | null;
}

const ProjectPage: React.FC = () => {
  const { project_id } = useParams();
  console.log(project_id);
  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [settingView, setSettingView] = useState<boolean>(false);
  const [settingsForm, setSettingsForm] = useState<Settings | null>(null);
  const [picUploaded, setPicUploaded] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSettingsLoading, SetIsSettingLoading] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");
  const [isDeleteLoading, setisDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleSubmitSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
    if(isSettingsLoading)
      return;
    SetIsSettingLoading(true);
    const fetchData = async () =>{
      const formData = new FormData();
      if(settingsForm){
        formData.append("name", settingsForm.projectName);
        if(settingsForm.projectDesc)
          formData.append("description", settingsForm.projectDesc)
        if(settingsForm.projectPic)
          formData.append("pic", settingsForm.projectPic);
      }
      const response = await fetch(`http://127.0.0.1:8000/project/${project_id}`, {
        method: "POST",
        headers:{
          "access-token": `${sessionStorage.getItem("access_token")}`
        },
        body: formData
      })

      const responseBody = await response.json()
      if(responseBody && responseBody.detail)
        alert("Failed");
      else{
        alert("Success");
        SetIsSettingLoading(false);
        if(settingsForm && data){
          data.project.name = settingsForm.projectName;
          data.project.description = settingsForm.projectDesc?settingsForm.projectDesc:"";
          data.project.pic_url = settingsForm.projectPicUrl?settingsForm.projectPicUrl:"http://127.0.0.1:8000/profile_pic/default_user.jpg"
        }
      }
      setSettingView(false);
      SetIsSettingLoading(false);
    }

    fetchData();
  };

  const handlePicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSettingsForm((prevState) => ({
        ...prevState!,
        projectPic: file,
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDiscardPic = () => {
    setSettingsForm((prevState) => ({
      ...prevState!,
      projectPic: null,
    }));
    setPreviewUrl(null);
  };

  const handleOpenSettings = ()=>{
    setSettingView(true);
    setPreviewUrl(data?.project.pic_url || null);
  };

  const handleDeleteProject = ()=>{
    const fetchData = async ()=>{
      const response = await fetch(`http://127.0.0.1:8000/project/${data?.project.id}`, {
        headers:{
          "access-token": `${sessionStorage.getItem("access_token")}`
        },
        method: "DELETE" 
      })
      const responseBody = await response.json();
    };

    const flow = async ()=>{
      setisDeleteLoading(true);
      setDeleteError("");
      await fetchData();
      setisDeleteLoading(false);
      window.location.href = "/dashboard";
    }
    if(deleteConfirmText==data?.project.name){
      flow();
    }
    else 
      setDeleteError("Incorrect input");
  };

  const handleDeleteConfirm = ()=>{
    setShowDeleteConfirm(true);
  }


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
            
            setSettingsForm({
              projectName: data.project.name,
              projectDesc:data.project.description, 
              projectPicUrl:data.project.pic_url,
              projectPic:null
            });
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching project:', error);
          setLoading(false);
        });
    }
  }, [project_id]);

  const handleSettingsChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = event.target;
    setSettingsForm((prevState) => ({
      ...prevState!,
      [name]: value,
    }));
  };

  if (loading) return <PageLoader />;
  if (!data) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
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
  if(data.isMember == "not-member") return (
    <div>
      <ComponentHeader isLoggedIn={true} route={'/projectMain'} />
      <div className='pt-16 grid grid-cols-12 gap-8 min-h-screen bg-slate-900 text-white'>
        <div className='col-span-8'>
          <div className='w-full h-72 p-10'>
            <img src={data.project.pic_url} className='cursor-pointer w-full h-full object-cover rounded-lg shadow-md' />
          </div>
          <div className='text-5xl font-bold px-10 pt-10'>{data.project.name}</div>
          <div className='px-10 pb-10 pt-4 text-gray-600'>Created at: {formatDateTimeToUserTimezone(data.project.created_at)}</div>
          <div className='px-10 text-lg text-slate-100' dangerouslySetInnerHTML={{ __html: (data.project.description || '').replace(/\n/g, '<br>') }}></div>
          <div className='flex flex-wrap p-10 gap-2'>
            {data.skills.map((skill) => (
              <div key={skill.id} className='cursor-pointer rounded-full shadow-lg px-4 py-2 text-center flex items-center justify-center border-2 border-slate-100 hover:bg-slate-100 hover:text-slate-900'>
                {skill.name}
              </div>
            ))}
          </div>
        </div>
        <div className='col-span-4 p-6 rounded-lg shadow-slate-900  shadow-xl bg-gray-800 my-10 mr-10'>
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
  if(data.isMember == "owner")
  return (
    <div>
      <Modal show={settingView} onClose={() => setSettingView(false)}>
        <Modal.Header />
        <Modal.Body>
          <Tabs aria-label="Tabs with icons" className='mx-1 gap-2'>
            <Tabs.Item active title="Project">
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Name" />
                </div>
                <TextInput
                  placeholder="Enter name"
                  value={settingsForm?.projectName}
                  onChange={handleSettingsChange}
                  required
                  name="projectName"
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="description" value="Description" />
                </div>
                <TextInput
                  placeholder="Enter Description"
                  value={settingsForm?.projectDesc}
                  onChange={handleSettingsChange}
                  required
                  name="projectDesc"
                />
              </div>
              <div>
              <div className="mb-2 block">
                  <Label htmlFor="projectImage" value="Project Image" />
                </div>
                <div className="flex flex-col items-center">
                  {previewUrl ? (
                    <div className="relative w-full max-w-md mb-4">
                      <img src={previewUrl} alt="Project preview" className="w-full h-auto rounded-lg" />
                      <button
                        onClick={handleDiscardPic}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="mb-4 text-gray-500">No image selected</div>
                  )}
                  <Label
                    htmlFor="dropzone-file"
                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <FileInput id="dropzone-file" className="hidden" accept="image/*" onChange={handlePicUpload} name="projectPic" />
                  </Label>
                </div>
              </div>
            </div> 
            <div className='flex w-full gap-4 justify-center items-center my-10'>
              <Button className='w-48' onClick={handleSubmitSettings}>
                {isSettingsLoading? "Loading...":"Save"}
              </Button>
              <Button className='w-48 bg-red-600' onClick={handleDeleteConfirm}>
                {isSettingsLoading? "Loading...":"Delete"}
              </Button>
            </div>
            {showDeleteConfirm &&
            <div>
              Are you sure you want to delete this project? This action is irreversible.
              <br />
              Type "<span className='font-bold'>{data.project.name}</span>" to delete it
              <div className='flex flex-row gap-4 w-full justify-center items-center pt-4'>
                <TextInput
                value={deleteConfirmText}
                onChange={(event)=> setDeleteConfirmText(event.target.value)}
                required
                className='w-4/5'
                ></TextInput>
                <Button onClick={handleDeleteProject}>{isDeleteLoading?"Loading...":"Submit"}</Button>
              </div>
              {deleteError?
                <div className='text-red-600'>{deleteError}</div>:<></>}
            </div>}
            </Tabs.Item>
            <Tabs.Item title="Permissions">
              <div>
                <div className='flex flex-row gap-4 items-center my-4 justify-between'>
                  <div className='flex flex-row justify-center items-center gap-6'>
                    <div className=''>
                      <img src={data.owner.profile_pic} className='object-cover rounded-full w-10 h-10'></img>
                    </div>
                    <div>@ {data.owner.username}</div>
                  </div>
                  <div className='bg-slate-800 text-white p-2 rounded'> Owner</div>
                </div>
                <hr />
                  {data.admins.map((admin)=>(
                    <div className='flex flex-row gap-4 items-center my-4 justify-between'>
                      <div className='flex flex-row justify-center items-center gap-6'>
                        <div className=''>
                          <img src={admin.profile_pic} className='object-cover w-10 h-10 rounded-full'></img>
                        </div>
                        <div>@ {admin.username}</div>
                      </div>  
                      <div className='bg-slate-600 text-white p-2 rounded'> Admin</div>
                      <div className='text-red-600 font-bold'>Revoke</div>
                      <hr />
                    </div>
                  ))}
              </div>
              <div>
                {data.members.map((member)=>(
                  <div>
                    <div className='flex flex-row gap-4 items-center my-4 justify-between'>
                      <div className='flex flex-row gap-6 items-center'>
                        <div className='w-10 h-10 rounded-full'>
                          <img src={member.profile_pic} className='object-cover'></img>
                        </div>
                        <div>@ {member.username}</div>
                      </div>
                      <div className='flex flex-row gap-6 items-center'>
                        <div className='bg-slate-400 text-white p-2 rounded'> Member</div>
                        <div className='text-red-600 font-bold'>Promote</div>
                      </div>
                    </div>
                    <hr />
                  </div> 
                ))}
              </div>
            </Tabs.Item>
          </Tabs>
        </Modal.Body>
      </Modal>
      <div className='pt-16 grid grid-cols-8 md:grid-cols-12 gap-8 min-h-screen bg-slate-900 text-white'>
        <div className='col-span-8'>
          <div className='w-full h-72 p-10'>
            <img src={data.project.pic_url} className='cursor-pointer w-full h-full object-cover rounded-lg shadow-md' />
          </div>
          <div className='text-5xl font-bold px-10 pt-10'>{data.project.name}</div>
          <div className='px-10 pb-10 pt-4 text-gray-600'>Created at: {formatDateTimeToUserTimezone(data.project.created_at)}</div>
          <div className='px-10 text-lg text-slate-100' dangerouslySetInnerHTML={{ __html: (data.project.description || '').replace(/\n/g, '<br>') }}></div>
          <div className='flex flex-wrap p-10 gap-2'>
            {data.skills.map((skill) => (
              <div key={skill.id} className='cursor-pointer rounded-full shadow-lg px-4 py-2 text-center flex items-center justify-center border-2 border-slate-100 hover:bg-slate-100 hover:text-slate-900'>
                {skill.name}
              </div>
            ))}
          </div>
        </div>
        <div className='col-span-8 md:col-span-4 p-6 rounded-lg shadow-slate-900  shadow-xl bg-gray-800 my-10 m-10 md:ml-0'>
          <div className='flex flex-row justify-between'>
            <h2 className="text-2xl font-bold mb-4 mt-10">Project Details</h2>
            <div className='my-10 cursor-pointer' onClick={handleOpenSettings}>
              Settings
            </div>
          </div>
          
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
  )
  if(data.isMember == "admin")
    return (<></>)
  return (<></>)
};

export default ProjectPage;
