    Welcome to my pet project!
In this repository you will find movie-info site, based on django, postgre , pytest and other python modules 

To use this repository you need Docker. Usage: from repository root run in cmd (or powershell): 
1." Docker build ." 
2. "Docker-compose up" 
3. Visit localhost:8000 in your browser
You can also use virtual enviroment to run this project, but you need postgres to be installed, and feed postgres movies.dump using PSQL and credentials from .env file

Purpose of this site is to give user a nice opportunity to filter database and find right film to right moment. Here you can easilly search film about London or Paris, or you can find scary film about Rachel. For me, personaly is important to cut off something, I don't like, or is not best choise for this evening. For example, I might want to see comedy, but not drama or cartoon, or one from 19xx-s with rating 3.1 . Also I might search for horror, but not a thriller or anime . So, you are welcome to try yourself ;)

Technical tips

List of films with cast, year, rating is parsed from IMDB site. Images are parsed from Amazon site, using link from IMDB. After that, plots are parsed from Wikipedia. Plots from wiki are usefull, because they describe everything very literally, so it gives us opportunity to search names, places , etc from plots. View readme.txt in parser folder for details. Parsed data can be applied to site from profile page of any admin account. Also admins have acces to form, which is used to add film manually.
List of all tags, genres and countries, that are used in existing db are cashed from button, accessed from main menu of any admin account. 
Base is not including all films possible, so as not to be to heavy. It includes films with higher rating, and does not include bigger part of old films.

Database is built on PostgreSQL, and use its external HStore and ArrayField . Current project does not use external models for actors, directors and additional images and video, because parsed data is not accurate and it can bring chaos to the project, but it can be changed in the future.
Project includes some tests using pytest factories, selenium and StaticLiveServerTestCase.
Rating, token from IMDB for default = 20votes. After all ratings of Filmbrary applied. Score are stored in account, and if user changes score old score is deleted and system recounts total rating. Film model stores only number of votes and averge rating, as it is not commercial project and it is not mean't to be too complicated.
After you change filters and go to another page, page reminds fields 'search', 'country', 'year', 'rating' and loses all tags and genres. It makes easier to clear query if nothing is found, and economies many lines of code.
Bootstrap is used for styling of everything. It does most of job, so css file is not to big.

Lots of thanks to creators of "Highly-Customizable-Range-Slider-Plugin-For-Bootstrap-Bootstrap-Slider".It is used for choosing rating, years in filters. Special modified version ( which took me several days of exploring its css features) is aplied to rating in detailed page. It has its own library where every single file of css and js is modified and all names and classes are renamed not to collide with filters slider library.


Contact me
python@writeme.com
