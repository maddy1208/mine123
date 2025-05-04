use std::fs::File;
use std::io::{self, BufRead, BufReader};
use reqwest::blocking::Client;
use colored::*;
use std::collections::HashSet;
use url::Url;

fn replace_http_parameters(url: &str, payload: &str) -> String {
    if let Ok(mut parsed_url) = Url::parse(url) {
        let modified_query: Vec<(String, String)> = parsed_url
            .query_pairs()
            .map(|(key, value)| {
                if value.starts_with("http") {
                    (key.to_string(), payload.to_string())
                } else {
                    (key.to_string(), value.to_string())
                }
            })
            .collect();
        parsed_url.query_pairs_mut().clear().extend_pairs(modified_query);
        return parsed_url.to_string();
    }
    url.to_string()
}

fn is_valid_url(url: &str) -> bool {
    match Url::parse(url) {
        Ok(parsed_url) => parsed_url.scheme() == "http" || parsed_url.scheme() == "https",
        Err(_) => false,
    }
}

fn main() -> io::Result<()> {
    println!("{}","                                                                                                                                                                                                                                                                                         
                             ..................=------=====------:.......         :+-     
                        :+********+++++=---====+*****#*+=++++=++**++++=+*-        --:     
                     ..-######**********===--=++***++++***++***+**++++++***+++++++***=    
 .----==+++****+++*****############**##**********#**+++++++======.......:..........:      
 =#***************#****++#####*++---*###****-.....::.                                     
  ##*******#####*+=-:.   +****=:.   +*+###*#+                                             
  +######**+=-:.         +**+:  .     .####*#=                                            
  .#*+=:.               =***-          :####*#+                                           
                        .*#*=            :####*#*-                                        
                        .-=:             .*###**#*-                                       
                                           -######+                                       
                                             -*##-                                        
                                                .      
       Version: 1.0                                   
                                                                                          
    ".red());

    println!("{}","Script by LegionHunter".bright_red());
    println!("Enter the filename containing the list of URLs:");
    let mut filename = String::new();
    io::stdin().read_line(&mut filename)?;
    let filename = filename.trim();

    let file = File::open(filename)?;
    let reader = BufReader::new(file);
    let urls: Vec<String> = reader.lines().filter_map(|line| line.ok()).collect();

    let payload = "http://evil.com"; 
    let client = Client::new();
    let mut tested_urls = HashSet::new();

    for url in urls {
        let modified_url = replace_http_parameters(&url, payload);

        if tested_urls.contains(&modified_url) {
            continue;         }

        if !is_valid_url(&modified_url) {
            println!("Skipping unsupported URL scheme for: {}", modified_url);
            continue;
        }

        match client.get(&modified_url).send() {
            Ok(response) => {
                let status = response.status();

                if status.is_redirection() {
                    if let Some(location) = response.headers().get("Location") {
                        let location_str = location.to_str().unwrap_or("");
                        if location_str == payload {
                            println!("{} {}", "Open Redirect Found:".red(), modified_url);
                        } else {
                            println!("{} {}: {}", "Redirect to different location for".red(), modified_url, location_str);
                        }
                    } else {
                        println!("{} {}", "Redirection status but no Location header for".red(), modified_url);
                    }
                } else {
                    let body = response.text().unwrap_or_else(|_| String::from(""));
                    if body.contains("The fake ones are the ones that scream the most") {
                        println!("{} {}", "Open Redirect Found in response body:".red(), modified_url);
                    } else {
                        println!("{} {}: Status {}", "No redirect for".green(), modified_url, status);
                    }
                }
            }
            Err(e) => eprintln!("Failed to send request to {}: {}", modified_url, e),
        }

        tested_urls.insert(modified_url); 
    }

    Ok(())
}
