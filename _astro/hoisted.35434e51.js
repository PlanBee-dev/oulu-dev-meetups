import"./hoisted.49d07815.js";const o=document.getElementById("submit-form"),t=document.getElementById("submit-form-fieldset");async function l(n){if(n.preventDefault(),!o||!t){console.log("no element");return}const s=new FormData(o),r=Object.fromEntries(s.entries());t.disabled=!0;const[e]=await Promise.allSettled([fetch({}.PUBLIC_API_BASE_URL,{method:"POST",body:JSON.stringify(r),headers:{"Content-Type":"application/json"}}),new Promise(a=>setTimeout(a,800))]);if(t.disabled=!1,e.status==="rejected"){console.error("Error submitting form",e.reason);return}if(e.status!=="fulfilled"){console.log("no response");return}const i=await e.value.json();console.log(i)}o.addEventListener("submit",l,!1);