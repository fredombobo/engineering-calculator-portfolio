import HomeClient from './HomeClient';
import { getAllWorks } from '@/lib/works';

export default function HomePage() {
  const works = getAllWorks();
  return <HomeClient works={works} />;
}
