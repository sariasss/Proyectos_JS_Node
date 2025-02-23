

const AboutPage = () => {
  return (
    <div> 
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 shadow.lg min-h-[150px]"> 
        <h1 className="font-bold text-center text-4xl text-white pt-10 pb-30">ABOUT US</h1>    
      </div>
      <div className="absolute top-95 mx-auto left-1/2 -translate-x-1/2 -translate-y-1/2">
      <img src="../public/pato.jpg" alt="imagen pokemon" className="w-140  rounded-xl shadow-grey shadow-md"/>
        <p className="mt-6 mb-4 text-center">Sara Arias Hernández</p>

        <div className="flex justify-around">
          <a href="https://www.linkedin.com/in/sara-arias-ab4968348/" target="_blank"><i className="fa-brands fa-linkedin text-3xl"></i></a>
          <a href="https://www.instagram.com/sariass__/?hl=es" target="_blank" ><i className="fa-brands fa-instagram text-3xl" ></i></a>
          <a href="https://github.com/sariasss" target="_blank"><i className="fa-brands fa-github text-3xl"> </i></a>
        </div>
       
      </div>
    </div>
  )
}

export default AboutPage
