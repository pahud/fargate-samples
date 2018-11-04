#!/bin/bash

sed -ri 's/^ServerTokens\s*OS/ServerTokens Prod/g' /etc/apache2/conf-enabled/security.conf
sed -ri 's/^ServerSignature\s*On/ServerSignature Off/g' /etc/apache2/conf-enabled/security.conf

