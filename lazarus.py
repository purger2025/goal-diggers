import requests
from bs4 import BeautifulSoup
import whois
import dns.resolver
import time
import random
from collections import deque

# ==========================================
# LAZARUS V2: THE INFINITE CRAWLER
# ==========================================

print("\033[1;36m[LAZARUS] INITIALIZING DEEP WEB CRAWLER...\033[0m")

# QUEUE: Pages we want to scan
# VISITED: Pages we have already scanned (to avoid loops)
crawl_queue = deque(["https://en.wikipedia.org/wiki/Sports_betting"])
visited_pages = set()

def is_domain_dead(domain):
    """Checks if DNS fails (Dead)."""
    try:
        dns.resolver.resolve(domain, 'A')
        return False
    except:
        return True

def check_availability(domain):
    """Checks if domain is buyable."""
    try:
        w = whois.whois(domain)
        if w.status == None: return True
        return False
    except:
        return True

def crawl():
    while len(crawl_queue) > 0:
        # Get next page from queue
        current_url = crawl_queue.popleft()
        
        if current_url in visited_pages:
            continue
            
        print(f"\n\033[1;34m[CRAWLING] {current_url}\033[0m")
        visited_pages.add(current_url)
        
        try:
            # Fake User Agent to avoid bans
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            response = requests.get(current_url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 1. FIND EXTERNAL LINKS (The Targets)
            links = soup.find_all('a', href=True)
            print(f"   > Found {len(links)} links. Filtering...")
            
            for link in links:
                href = link['href']
                
                # LOGIC A: If it's an external link, CHECK IT
                if href.startswith('http') and "wiki" not in href:
                    try:
                        domain = href.split('/')[2]
                        # Filter giants
                        if any(x in domain for x in ['google', 'facebook', 'twitter', 'youtube', 'instagram']):
                            continue
                            
                        if is_domain_dead(domain):
                            print(f"\033[1;33m   [POTENTIAL] Dead: {domain}\033[0m")
                            if check_availability(domain):
                                print(f"\033[1;32m🚨 [JACKPOT] AVAILABLE: {domain}\033[0m")
                                with open("jackpots.txt", "a") as f:
                                    f.write(f"{domain} - Found on {current_url}\n")
                    except: pass

                # LOGIC B: If it's another Wiki page, ADD TO QUEUE
                elif href.startswith('/wiki/') and ":" not in href:
                    full_wiki_url = "https://en.wikipedia.org" + href
                    if full_wiki_url not in visited_pages:
                        crawl_queue.append(full_wiki_url)

            print(f"   > Queue Size: {len(crawl_queue)} pages remaining.")
            # Sleep to prevent IP Ban
            time.sleep(2)

        except Exception as e:
            print(f"[ERROR] Failed to crawl page: {e}")

if __name__ == "__main__":
    try:
        crawl()
    except KeyboardInterrupt:
        print("\n[LAZARUS] Crawler Stopped.")
