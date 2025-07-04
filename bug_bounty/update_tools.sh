#!/bin/bash

set -e  # Exit on any error

echo "[*] Updating Bash and Python tools..."
pdtm -up
subfinder -up
pip3 install --upgrade waymore --break-system-packages
nuclei -up
nuclei -ut

echo "[*] Updating Go tools..."
go install github.com/ffuf/ffuf/v2@latest
sudo cp ~/go/bin/ffuf /usr/local/bin

echo "[*] Updating Git-based tools..."

cd /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/loxs && git pull 
cd /home/maddy/techiee/bug_bounty/bin_deps/SecLists && git pull 
cd /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/sqlmap && git pull 

# Re-clone nuclei templates cleanly (to avoid merge errors)
/home/maddy/techiee/bug_bounty/2_phase_recon_autom/automation/nuclei-temp/lostsec && git pull
cd /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/lazyegg && git pull 
cd /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/LinkFinder && git pull 
cd /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/SecretFinder && git pull 

cd /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/customBsqli && git pull 
cd /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/scan4all && git pull 
cd /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/XSStrike && git pull 
cd /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/WayBackupFinder && git pull 

echo "[*] Updating Jaeles..."
go install github.com/jaeles-project/jaeles@latest

# ✅ Critical Fix: Go installs to ~/go/bin (not ~/.go/bin)
sudo cp ~/go/bin/jaeles /usr/local/bin/
jaeles config update -y

echo "[✓] All tools updated."

