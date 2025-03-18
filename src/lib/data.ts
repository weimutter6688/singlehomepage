'use server';

import { promises as fs } from 'fs';
import path from 'path';

// Path to our JSON data file
const dataFilePath = path.join(process.cwd(), 'src/data/links.json');

// Link type definition
export interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  categories: string[];
}

// Data structure
export interface LinksData {
  links: Link[];
}

// Read all links from JSON file
export async function getLinks(): Promise<Link[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const jsonData: LinksData = JSON.parse(data);
    return jsonData.links;
  } catch (error) {
    console.error('Error reading links data:', error);
    return [];
  }
}

// Add a new link
export async function addLink(link: Omit<Link, 'id'>): Promise<Link> {
  const links = await getLinks();

  // Generate a new ID (simple implementation)
  const newId = (links.length > 0)
    ? String(Math.max(...links.map(l => parseInt(l.id))) + 1)
    : '1';

  const newLink: Link = {
    ...link,
    id: newId
  };

  const updatedLinks = [...links, newLink];
  await saveLinks(updatedLinks);

  return newLink;
}

// Update an existing link
export async function updateLink(link: Link): Promise<Link | null> {
  const links = await getLinks();
  const index = links.findIndex(l => l.id === link.id);

  if (index === -1) return null;

  links[index] = link;
  await saveLinks(links);

  return link;
}

// Delete a link
export async function deleteLink(id: string): Promise<boolean> {
  const links = await getLinks();
  const filteredLinks = links.filter(link => link.id !== id);

  if (filteredLinks.length === links.length) {
    return false; // No link was deleted
  }

  await saveLinks(filteredLinks);
  return true;
}

// Save links to JSON file
export async function saveLinks(links: Link[]): Promise<void> {
  try {
    const data: LinksData = { links };
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving links data:', error);
    throw error;
  }
}

// Get unique categories
export async function getCategories(): Promise<string[]> {
  const links = await getLinks();
  // Flatten all categories arrays and get unique values
  const categories = new Set(links.flatMap(link => link.categories));
  return Array.from(categories);
}