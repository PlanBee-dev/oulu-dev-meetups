// place any helper functions here
export type Meetup = {
	data: {
		name: string;
		description: string;
		time: string;
		location: string;
		locationLink: string | null;
		organizer: string;
		organizerLink: string | null;
		meetupLink: string;
		image: string | null;
	};
};

export const getRandomLogonumber = () => {
	const allowedNums = [1, 2, 3, 4, 5];
	let devLogoNum = Math.floor(Math.random() * 5) + 1;
	if (!allowedNums.includes(devLogoNum)) {
		devLogoNum = 1;
	}
	return devLogoNum;
};

export const parseMeetupDate = (date: string) => {
	if (!date) return -1;
	if (Date.parse(date) > 0) return Date.parse(date);
	else {
		const parsedDate = date.split(" ");
		const [year, month, day] = parsedDate[0]
			.split("-")
			.map((str) => parseInt(str));
		const [hour, minute] = parsedDate[1]
			.split(":")
			.map((str) => parseInt(str));
		return new Date(year, month - 1, day, hour, minute).getTime();
	}
};

export const getNextMeetup = (meetups: Meetup[]) => {
	if (!meetups || meetups.length === 0) return null;

	const currentDate = new Date();
	const futureMeetups = meetups.filter((meetup: Meetup) => {
		return parseMeetupDate(meetup.data.time) > currentDate.getTime();
	});

	if (futureMeetups.length === 0) return null;

	futureMeetups.sort((a: Meetup, b: Meetup) => {
		return parseMeetupDate(a.data.time) - parseMeetupDate(b.data.time);
	});
	return futureMeetups[0];
};
