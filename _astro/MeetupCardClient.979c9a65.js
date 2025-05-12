import{formatMeetupData as g,createShortDescription as c}from"./utils.08e5c1db.js";function v(s,e){if(!s||!e)return;const a={title:s.title,date:s.date instanceof Date?s.date.toISOString():String(s.date),location:s.location||"",locationLink:s.locationLink||"",organizer:s.organizer||"",organizerLink:s.organizerLink||"",signupLink:s.signupLink||"",description:s.body||"",time:"00:00"},t=g(a),n=c(s.body||s.shortDescription||""),i=new Date(t.date),d={weekday:"long",year:"numeric",month:"long",day:"numeric"},o=i.toLocaleDateString(void 0,d),r={hour:"2-digit",minute:"2-digit"},l=i.toLocaleTimeString(void 0,r),m=`
    <div class="m-auto max-w-2xl overflow-hidden bg-white shadow sm:rounded-lg">
      <!--card header -->
      <div class="border-b border-gray-200 bg-sky-100 px-4 py-5 sm:px-6">
        <div class="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div class="ml-4 mt-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <img
                  class="h-12 w-12 rounded-full"
                  src="${window.location.pathname.includes("/oulu-dev-meetups")?"/oulu-dev-meetups":""}/images/logos/1-meetup-logo.jpg"
                  alt="developer logo"
                />
              </div>
              <div class="ml-4">
                <a href="${window.location.pathname.includes("/oulu-dev-meetups")?"/oulu-dev-meetups":""}/meetups/${s.slug||""}">
                  <h3 class="text-base font-semibold leading-6 text-gray-900">
                    ${t.title}
                  </h3>
                </a>
                <p class="text-sm text-gray-500">
                  ${t.organizer}
                </p>
              </div>
            </div>
          </div>
          ${t.signupLink?`
          <div class="ml-4 mt-4 flex flex-shrink-0">
            <a href="${t.signupLink}" target="_blank">
              <button
                type="button"
                class="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="mr-2 h-6 w-6 text-gray-400"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                  >
                  </path>
                </svg>
                <span>Sign up</span>
              </button>
            </a>
          </div>
          `:""}
        </div>
      </div>
      <!--card body -->
      <div class="border-t border-gray-100">
        <dl class="divide-y divide-gray-100">
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">When</dt>
            <dd
              class="mt-1 font-semibold leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
            >
              ${o} at ${l}
            </dd>
          </div>
          ${t.location?`
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">Where</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              ${t.locationLink?`<a href="${t.locationLink}" target="_blank">${t.location}</a>`:t.location}
            </dd>
          </div>
          `:""}
          ${t.organizer?`
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">Organizer</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              ${t.organizerLink?`<a href="${t.organizerLink}" target="_blank">${t.organizer}</a>`:t.organizer}
            </dd>
          </div>
          `:""}
          ${t.signupLink?`
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">Sign up link</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <a href="${t.signupLink}" target="_blank">${t.signupLink}</a>
            </dd>
          </div>
          `:""}
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">Description</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <a href="${window.location.pathname.includes("/oulu-dev-meetups")?"/oulu-dev-meetups":""}/meetups/${s.slug||""}">
                ${n}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  `;e.innerHTML=m}export{v as renderMeetupCard};
