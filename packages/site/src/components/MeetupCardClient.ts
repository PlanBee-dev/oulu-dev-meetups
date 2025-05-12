/**
 * Client-side renderer for MeetupCard
 */

import { formatMeetupData, createShortDescription } from '../utils';
import type { FrontMeetup } from '../get-meetups';

/**
 * Renders a meetup card in the specified container
 * @param meetup - The meetup data
 * @param container - The container element to render the card in
 */
export function renderMeetupCard(meetup: FrontMeetup, container: HTMLElement) {
  if (!meetup || !container) return;

  // Instead of directly passing the FrontMeetup to formatMeetupData,
  // we'll extract the relevant fields to match what formatMeetupData expects
  const meetupForFormatting = {
    title: meetup.title,
    date:
      meetup.date instanceof Date
        ? meetup.date.toISOString()
        : String(meetup.date),
    location: meetup.location || '',
    locationLink: meetup.locationLink || '',
    organizer: meetup.organizer || '',
    organizerLink: meetup.organizerLink || '',
    signupLink: meetup.signupLink || '',
    // These fields might not be used by formatMeetupData but are included for type compatibility
    description: meetup.body || '',
    time: '00:00', // Default time if not available
  };

  const formattedMeetup = formatMeetupData(meetupForFormatting);
  const shortDescription = createShortDescription(
    meetup.body || meetup.shortDescription || '',
  );

  // Format date
  const meetupDate = new Date(formattedMeetup.date);
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const formattedDate = meetupDate.toLocaleDateString(undefined, dateOptions);

  // Format time
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  const formattedTime = meetupDate.toLocaleTimeString(undefined, timeOptions);

  // Create card HTML
  const cardHTML = `
    <div class="m-auto max-w-2xl overflow-hidden bg-white shadow sm:rounded-lg">
      <!--card header -->
      <div class="border-b border-gray-200 bg-sky-100 px-4 py-5 sm:px-6">
        <div class="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div class="ml-4 mt-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <img
                  class="h-12 w-12 rounded-full"
                  src="${
                    window.location.pathname.includes('/oulu-dev-meetups')
                      ? '/oulu-dev-meetups'
                      : ''
                  }/images/logos/1-meetup-logo.jpg"
                  alt="developer logo"
                />
              </div>
              <div class="ml-4">
                <a href="${
                  window.location.pathname.includes('/oulu-dev-meetups')
                    ? '/oulu-dev-meetups'
                    : ''
                }/meetups/${meetup.slug || ''}">
                  <h3 class="text-base font-semibold leading-6 text-gray-900">
                    ${formattedMeetup.title}
                  </h3>
                </a>
                <p class="text-sm text-gray-500">
                  ${formattedMeetup.organizer}
                </p>
              </div>
            </div>
          </div>
          ${
            formattedMeetup.signupLink
              ? `
          <div class="ml-4 mt-4 flex flex-shrink-0">
            <a href="${formattedMeetup.signupLink}" target="_blank">
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
          `
              : ''
          }
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
              ${formattedDate} at ${formattedTime}
            </dd>
          </div>
          ${
            formattedMeetup.location
              ? `
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">Where</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              ${
                formattedMeetup.locationLink
                  ? `<a href="${formattedMeetup.locationLink}" target="_blank">${formattedMeetup.location}</a>`
                  : formattedMeetup.location
              }
            </dd>
          </div>
          `
              : ''
          }
          ${
            formattedMeetup.organizer
              ? `
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">Organizer</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              ${
                formattedMeetup.organizerLink
                  ? `<a href="${formattedMeetup.organizerLink}" target="_blank">${formattedMeetup.organizer}</a>`
                  : formattedMeetup.organizer
              }
            </dd>
          </div>
          `
              : ''
          }
          ${
            formattedMeetup.signupLink
              ? `
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">Sign up link</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <a href="${formattedMeetup.signupLink}" target="_blank">${formattedMeetup.signupLink}</a>
            </dd>
          </div>
          `
              : ''
          }
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-900">Description</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <a href="${
                window.location.pathname.includes('/oulu-dev-meetups')
                  ? '/oulu-dev-meetups'
                  : ''
              }/meetups/${meetup.slug || ''}">
                ${shortDescription}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  `;

  // Set the HTML content
  container.innerHTML = cardHTML;
}
