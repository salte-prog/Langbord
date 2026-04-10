import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OmLangbord from "@/components/OmLangbord";
import RiddleCard from "@/components/RiddleCard";
import MemberGallery from "@/components/MemberGallery";
import PastMeetings from "@/components/PastMeetings";
import Footer from "@/components/Footer";
import { getMembers, getNextMeeting, getPastMeetings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [members, nextMeeting, pastMeetings] = await Promise.all([
    getMembers(),
    getNextMeeting(),
    getPastMeetings(),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <OmLangbord />
        <RiddleCard meeting={nextMeeting} />
        <MemberGallery members={members} />
        <PastMeetings meetings={pastMeetings} />
      </main>
      <Footer />
    </>
  );
}
