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
  
  const formattedMeetup = formatMeetupData(meetup);
  const shortDescription = createShortDescription(formattedMeetup.description || '');
  
  // Format date
  const meetupDate = new Date(formattedMeetup.date);
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = meetupDate.toLocaleDateString(undefined, dateOptions);
  
  // Format time
  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  const formattedTime = meetupDate.toLocaleTimeString(undefined, timeOptions);
  
  // Create card HTML
  const cardHTML = `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl">
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">${formattedMeetup.title}</h3>
            <div class="mt-2 max-w-xl text-sm text-gray-500">
              <p>${shortDescription}</p>
            </div>
            <div class="mt-3 text-sm">
              <div class="font-medium text-indigo-600 hover:text-indigo-500">
                ${formattedDate} at ${formattedTime}
              </div>
              ${formattedMeetup.location ? `<div>Location: ${formattedMeetup.location}</div>` : ''}
              ${formattedMeetup.organizer ? `<div>Organizer: ${formattedMeetup.organizer}</div>` : ''}
            </div>
            <div class="mt-5">
              ${formattedMeetup.signupLink ? 
                `<a href="${formattedMeetup.signupLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Sign up</a>` : 
                ''
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Set the HTML content
  container.innerHTML = cardHTML;
}
