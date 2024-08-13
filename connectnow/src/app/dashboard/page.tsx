"use client";

import { useEffect, useState } from "react";
import AppFooter from "../components/AppFooter";
import ComponentHeader from "../components/ComponentHeader";
import PageLoader from "../components/PageLoader";
import { Button, Checkbox, Label, Modal, TextInput, FileInput, Textarea } from "flowbite-react"
import ProjectCard from "../components/ProjectCard";
import Layout from "../components/Layout";

interface Project {
  id: number;
  admin_id: number;
  name: string;
  description: string | null;
  pic_url: string | null;
  pic_path: string | null;
  status: string;
  created_at: string;
}

interface ProjectResponse {
  owned: Project[];
  member: Project[];
}

export default function Dashboard() {
  const [accessTokenExists, setAccessTokenExists] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<ProjectResponse>({
    owned: [],
    member: [],
  });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('');
  const [projectDesc, setProjectDesc] = useState<string>('');
  const [projectPic, setProjectPic] = useState<File | null>(null);
  const [picUploaded, setPicUploaded] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null)

  function onCloseModal() {
    setOpenModal(false);
  }


  const handlePicUpload = (event: React.ChangeEvent<HTMLInputElement>) =>{
    if(event.target.files){
      setPicUploaded(true);
      setProjectPic(event.target.files[0]);
      setPreviewUrl(URL.createObjectURL(event.target.files[0]));
    }
  }

  const handleDiscardPic = (event: React.MouseEvent<SVGSVGElement>) =>{
    event.preventDefault();
    setPicUploaded(false);
    setProjectPic(null);
    setPreviewUrl(null);
  }

  const handleCreateProject = (event: React.MouseEvent<HTMLButtonElement>) =>{
    setIsLoading(true);
    setOpenModal(false);
    const access_token = sessionStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("name", projectName);
    if(projectDesc!="")
      formData.append("description", projectDesc);
    if(projectPic)
      formData.append("pic", projectPic);
    fetch("http://127.0.0.1:8000/project", {
      method: "POST",
      headers: {
        "access-token": `${access_token}`,
      },
      body: formData,
    })
    .then((response) => {
      if(response.status==401){
        const refresh_token = sessionStorage.getItem("refresh_token");
        fetch(`http://127.0.0.1:8000/auth/refresh/?refresh_token=${refresh_token}`, {
          method: "POST"
        }).then((response)=> response.json())
        .then((data) =>{
          sessionStorage.setItem("access_token", data.access_token);
          fetch("http://127.0.0.1:8000/project", {
            method: "POST",
            headers: {
              "access-token": `${data.access_token}`,
            },
            body: formData,
          }).then((response)=> response.json)
        })
      }
      else{
        return response.json();
      }
      })
    .then((data) => {
      console.log(data);
      const NewProject: Project = data.project;
      userInfo.owned.push(NewProject);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching user info:", error);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    const access_token = sessionStorage.getItem("access_token");

    if (access_token == null) {
      alert("You're not logged in");
      window.location.href = "/";
    } else {
      // Fetch user info
      fetch("http://127.0.0.1:8000/project/me", {
        headers: {
          "access-token": `${access_token}`,
        },
      })
        .then((response) =>{
          if(response.status==401){
            const refresh_token = sessionStorage.getItem("refresh_token");
            fetch(`http://127.0.0.1:8000/auth/refresh/?refresh_token=${refresh_token}`, {
              method: "POST"
            }).then((response)=> response.json())
            .then((data) =>{
              sessionStorage.setItem("access_token", data.access_token);
              fetch("http://127.0.0.1:8000/project/me", {
                headers: {
                  "access-token": `${access_token}`,
                },
              }).then((response)=> response.json)
            })
          }
          else{
            return response.json();
          }
        })
        .then((data) => {
          console.log(data);
          setUserInfo(data);
          console.log("UserInfo", userInfo);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          setIsLoading(false);
        });
    }
    const fetchData = async () => {
      try{
        const response = await fetch("http://127.0.0.1:8000/user", {
          headers:{
            "access-token": `${access_token}`
          }
        });
        const responseBody = await response.json();
        if(!responseBody.detail){
          setUserName(responseBody.name);
        }
  
      }
      catch{
        console.log("Error fetching user");
      }
    }
    fetchData();
  }, []);

  const handleAddProject = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the default action (optional, depending on your needs)
    event.preventDefault();
    setOpenModal(true);
    // Do something when the button is clicked
    
  };


  return (
    <div>
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="pt-16 h-auto bg-slate-900 text-white">
          <Modal show={openModal} size="md" onClose={onCloseModal} popup size="5xl">
            <Modal.Header />
            <Modal.Body>
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">Enter Project Details</h3>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="projectName" value="Name" />
                  </div>
                  <TextInput
                    id="projectName"
                    placeholder="Name"
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="projectDesc" value="Description (Optional)" />
                  </div>
                  <Textarea
                    className="h-48"
                    id="projectDesc"
                    placeholder="Description"
                    value={projectDesc}
                    onChange={(event) => setProjectDesc(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dropzone-file">
                    <div className="flex flex-row justify-between">
                      Image (Optional) 
                      {previewUrl && 
                      <svg onClick={handleDiscardPic} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                      <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>}
                    </div>
                  </Label>
                  <Label
                    htmlFor="dropzone-file"
                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    {picUploaded && previewUrl? <img src={previewUrl} />:
                    <>
                      <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      <svg
                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                  </>}
                  <FileInput id="dropzone-file" key={projectPic ? projectPic.name : 'file-input'} className="hidden" accept="image/*" onChange={handlePicUpload}/>
                  </Label>
                </div>
                <div className="w-full flex justify-center">
                  <Button size="lg" onClick={handleCreateProject}>Create Project</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          <div className="text-4xl p-10">Welcome <span className="hover:text-blue-800 cursor-pointer" onClick={(event: React.MouseEvent<HTMLSpanElement>)=>{window.location.href=`http://localhost:3000/user`;}}>{userName}</span>!</div>
          <hr className="border-slate-700"/>
          <div className="pb-10">
            {userInfo.owned.length == 0?
              userInfo.member.length == 0?
              <div className="flex flex-row gap-4 justify-center items-center ">
                <div className="flex items-center justify-center h-full">
                  <div className="p-6 bg-gradient-to-b from-sky-900 to-slate-900 text-white rounded-lg shadow-lg text-center">
                    <div className="text-2xl font-bold mb-2">You have no owned projects yet.</div>
                    <div className="text-lg mb-4">Create one now!</div>
                    <button onClick={handleAddProject} className="bg-white text-sky-500 hover:text-white hover:bg-sky-600 transition duration-300 ease-in-out py-2 px-4 rounded-lg font-semibold">
                      Create Project
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-center h-full">
                  <div className="p-6 bg-gradient-to-b from-sky-900 to-slate-900 text-white rounded-lg shadow-lg text-center">
                    <div className="text-2xl font-bold mb-2">You have no member projects yet.</div>
                    <div className="text-lg mb-4">Join one now!</div>
                    <button onClick={()=> window.location.href="/project"} className="bg-white text-sky-500 hover:text-white hover:bg-sky-600 transition duration-300 ease-in-out py-2 px-4 rounded-lg font-semibold">
                      Browse Projects
                    </button>
                  </div>
                </div>
              </div>:
              <div>
                <div className="flex items-center justify-center h-full">
                  <div className="p-6 bg-gradient-to-b from-sky-900 to-slate-900 text-white rounded-lg shadow-lg text-center">
                    <div className="text-2xl font-bold mb-2">You have no owned projects yet.</div>
                    <div className="text-lg mb-4">Create one now!</div>
                    <button onClick={handleAddProject} className="bg-white text-sky-500 hover:text-white hover:bg-sky-600 transition duration-300 ease-in-out py-2 px-4 rounded-lg font-semibold">
                      Create Project
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-12 my-10 mx-10">
                <div className="col-span-11 text-left text-2xl">Your Memberships</div>
              </div>
              <div className="grid grid-cols-5 gap-4 mt-10">
                {/* Render owned projects */}
                {userInfo &&  userInfo.member.map((project) => (
                  <ProjectCard
                    projectId={project.id}
                    key={project.id}
                    img={project.pic_url || ""}
                    name={project.name}
                    description={project.description || ""}
                  />
                ))}
              </div>
              </div>:
            userInfo.member.length == 0?
            <div>
              <div className="grid grid-cols-12 my-10 mx-10">
                <div className="col-span-11 text-left text-2xl">Your Projects</div>
                <Button className="col-span-1" onClick={handleAddProject}>Create New</Button>
              </div>
              <div className="grid grid-cols-5 gap-4 mt-10">
                {/* Render owned projects */}
                {userInfo && userInfo.owned.map((project) => (
                  <ProjectCard
                    projectId={project.id}
                    key={project.id}
                    img={project.pic_url || ""}
                    name={project.name}
                    description={project.description || ""}
                  />
                ))}
              </div>
              <div className="flex items-center justify-center h-full">
                <div className="p-6 bg-gradient-to-b from-sky-900 to-slate-900 text-white rounded-lg shadow-lg text-center">
                  <div className="text-2xl font-bold mb-2">You have no member projects yet.</div>
                  <div className="text-lg mb-4">Join one now!</div>
                  <button className="bg-white text-sky-500 hover:text-white hover:bg-sky-600 transition duration-300 ease-in-out py-2 px-4 rounded-lg font-semibold">
                    Browse Projects
                  </button>
                </div>
              </div>
            </div>:
            <div>
              <div className="grid grid-cols-12 my-10 mx-10">
                <div className="col-span-11 text-left text-2xl">Your Projects</div>
                <Button className="col-span-1" onClick={handleAddProject}>Create New</Button>
              </div>
              <div className="grid grid-cols-5 gap-4 mt-10">
                {/* Render owned projects */}
                {userInfo && userInfo.owned.map((project) => (
                  <ProjectCard
                    projectId={project.id}
                    key={project.id}
                    img={project.pic_url || ""}
                    name={project.name}
                    description={project.description || ""}
                  />
                ))}
              </div>
              <div className="grid grid-cols-12 my-10 mx-10">
                <div className="col-span-11 text-left text-2xl">Your Memberships</div>
              </div>
              <div className="grid grid-cols-5 gap-4 mt-10">
                {/* Render owned projects */}
                {userInfo &&  userInfo.member.map((project) => (
                  <ProjectCard
                    projectId={project.id}
                    key={project.id}
                    img={project.pic_url || ""}
                    name={project.name}
                    description={project.description || ""}
                  />
                ))}
              </div>
            </div>
          }
          </div>
          
          
        </div>
      )}
      <AppFooter />
    </div>
  );
}
