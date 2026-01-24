export interface Chapter {
    slug: string;
    name: string;
    status: string;
    established: string;
    venue: string;
    capacity?: string;
    highlight: string;
    color: string;
    country: string;
    description: string;
    upcomingEvent?: string;
    registrationOpen?: boolean;
    venueImage?: string;
    contactPhone?: string;
    contactEmail?: string;
    history?: { year: string; venue: string; event: string }[];
}

export const chapters: Chapter[] = [
    {
        slug: "nairobi",
        name: "Nairobi",
        status: "Mother Chapter",
        established: "2004",
        venue: "Winners' Chapel International, Likoni Road",
        capacity: "15,000+",
        highlight: "Celebrating 22 Years of Worship",
        color: "from-gold/20 to-gold/5",
        country: "Kenya",
        description: "The inaugural event of all AFLEWO chapters. First held in 2004 at CITAM Karen (formerly NPC Karen), it has birthed the rest of the movement. From 2013, the event moved to Winners' Chapel, the largest indoor facility in East Africa, bringing together over 15,000 people. It is the flagship of the continental worship vision.",
        upcomingEvent: "October 3, 2026 - Main Event",
        venueImage: "/archival-1.jpg",
        registrationOpen: true,
        contactPhone: "+254 700 000 000",
        contactEmail: "nairobi@aflewo.org",
        history: [
            { year: "2004", venue: "CITAM Karen", event: "Inaugural Night of Worship" },
            { year: "2007", venue: "Nyayo Stadium", event: "National Worship Gathering" },
            { year: "2013", venue: "Winners' Chapel", event: "Growth to 15,000+" }
        ]
    },
    {
        slug: "mombasa",
        name: "Mombasa",
        status: "Coastal Hub",
        established: "2009",
        venue: "Elim Sanctuary, Makupa",
        capacity: "5,000+",
        highlight: "Uniting the Coast in One Voice",
        color: "from-cyan-500/20 to-cyan-500/5",
        country: "Kenya",
        description: "First held in 2009 at the Elim Sanctuary in Makupa. Creditied with uniting the church in Mombasa by bringing together choirs from different denominations. Typically held in September, attracting more than 5,000 worshippers annually.",
        upcomingEvent: "September 2026 - Night of Unity",
        venueImage: "/archival-2.jpg",
    },
    {
        slug: "nakuru",
        name: "Nakuru",
        status: "Rift Valley Hub",
        established: "2013",
        venue: "Deliverance Church, Nakuru",
        capacity: "2,000+",
        highlight: "Birthed from the National 1,000 Voice Choir",
        color: "from-orange-500/20 to-orange-500/5",
        country: "Kenya",
        description: "Birthed in 2013 when the team was part of the 1,000 voice choir national event. Held their first event in August 2014 at Deliverance Church, Nakuru, with over 2,000 people. The chapter continues to grow as a pillar of worship in Central Rift.",
        upcomingEvent: "August 2026 - Rehearsals Active",
        registrationOpen: true,
        venueImage: "/mission-1.jpg",
    },
    {
        slug: "tanzania",
        name: "Tanzania",
        status: "Dar es Salaam Chapter",
        established: "2010",
        venue: "CCC Upanga Church",
        capacity: "4,000+",
        highlight: "First International AFLEWO Event",
        color: "from-emerald/20 to-emerald/5",
        country: "Tanzania",
        description: "Founded in 2010, AFLEWO Tanzania held its first event in April 2011 at Aga Khan Diamond Hall in Dar-es-Salaam. It was the first international event for AFLEWO. Since then, it has held multiple events at CCC Upanga church, drawing thousands of participants.",
        upcomingEvent: "April 2026 - Dar Worship Night",
        venueImage: "/archival-2.jpg"
    },
    {
        slug: "rwanda",
        name: "Rwanda",
        status: "Kigali Chapter",
        established: "2011",
        venue: "Christian Life Assembly (CLA), Nyarutarama",
        capacity: "3,000+",
        highlight: "Healing and Reconciliation",
        color: "from-blue-500/20 to-blue-500/5",
        country: "Rwanda",
        description: "AFLEWO Kigali was founded in 2011 and first held at CLA Nyarutarama. In March 2014, it held a significant event as part of the country’s 20-year commemoration of the genocide, focusing on themes of healing and reconciliation through worship.",
        upcomingEvent: "March 2026 - Commemoration Service",
        venueImage: "/archival-1.jpg"
    },
    {
        slug: "nyeri",
        name: "Nyeri",
        status: "Mt. Kenya Hub",
        established: "2010",
        venue: "PCEA Nyamachaki",
        capacity: "2,000+",
        highlight: "Pastors' Fellowship United",
        color: "from-green-600/20 to-green-600/5",
        country: "Kenya",
        description: "Founded in 2010 with its first event at PCEA Nyamachaki. The event has steadily grown with the support of the local pastors' fellowship, uniting over 2,000 worshippers from Nyeri town and its environs.",
        upcomingEvent: "October 2026 - Harvest Night",
        venueImage: "/mission-1.jpg"
    },
    {
        slug: "meru",
        name: "Meru",
        status: "Central Hub",
        established: "2012",
        venue: "KEMU Chapel",
        capacity: "2,500+",
        highlight: "Commemorating 50 Years of Independence",
        color: "from-lime-500/20 to-lime-500/5",
        country: "Kenya",
        description: "Founded in 2012 with its first event at Gikumene High School. The Meru choir was part of the AFLEWO 2013 1,000 voice choir at Winners' Chapel. The chapter continues to grow, moving its events to KEMU Chapel since 2014.",
        upcomingEvent: "September 2026 - Meru Worship Festival",
        venueImage: "/archival-2.jpg"
    }
];

export function getChapter(slug: string) {
    return chapters.find(c => c.slug === slug);
}
