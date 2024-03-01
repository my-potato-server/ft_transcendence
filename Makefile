############ PRESET #############

	############ PARAMETER #############

		PRESET_CFLAGS_FOR_SUBMIT	= -Wall -Wextra -Werror

NAME=Transcendence
COMPOSEYML=-f ./docker-compose.yml

# HOME_DIR = /home/snoh
# DATA_DIR = $(HOME_DIR)/data
# DOMAIN_NAME = $(shell grep -oP 'DOMAIN_NAME=\K[^ ]+' ./srcs/.env)

.PHONY : all $(NAME) up down

all: $(NAME) 

$(NAME) : up

up : #check_all prepare_volume
	sudo docker-compose $(COMPOSEYML) up --build -d

up2 : #check_all prepare_volume
	docker-compose $(COMPOSEYML) up --build

down : clean

#=============== MAINTENANCE RULES ===============#

#-------- CHECK REQUIREMENTS --------#

.PHONY : check_all check_home check_host remove_host

# check_all: check_home check_host

# check_home:
# 	@if [ ! -w $(HOME_DIR) ]; then echo "home doesn\'t matched with $(HOME_DIR)"; exit 1; fi

# check_host:
# 	@echo "127.0.0.1 $(DOMAIN_NAME)" | sudo tee -a /etc/hosts

# remove_host:
# 	@sudo sed -i '/$(DOMAIN_NAME)/d' /etc/hosts

#-------- MANAGE VOLUME PATH --------#

# .PHONY :	prepare_volume			\
# 			prepare_volume_path		\
# 			prepare_volume_mariadb	\
# 			prepare_volume_wordpress\

# prepare_volume: prepare_volume_mariadb prepare_volume_wordpress

# prepare_volume_path: check_home
# 	mkdir -p $(DATA_DIR)

# prepare_volume_mariadb: prepare_volume_path
# 	mkdir -p $(DATA_DIR)/mariadb

# prepare_volume_wordpress: prepare_volume_path
# 	mkdir -p $(DATA_DIR)/wordpress


#=============== BASIC RULES ===============#

#-------- REQUIREMENT --------#

.PHONY : clean fclean re

clean : # remove_host
	sudo docker-compose $(COMPOSEYML) down -v

fclean : clean 
	
re : 
	$(MAKE) fclean
	@echo 1 > /dev/null
	$(MAKE) all

#-------- ADDITIONAL --------#
.PHONY :	log		\
			ps		\
			interactive-n	\
			interactive-w	\
			interactive-m	\
			iclean

log :
	sudo docker-compose $(COMPOSEYML) logs -f

ps :
	sudo docker-compose $(COMPOSEYML) ps

# interactive-n :
# 	sudo docker-compose $(COMPOSEYML) exec nginx /bin/bash

# interactive-w :
# 	sudo docker-compose $(COMPOSEYML) exec wordpress /bin/bash

# interactive-m :
# 	sudo docker-compose $(COMPOSEYML) exec mariadb /bin/bash

iclean :
	sudo docker rmi $$(sudo docker images -q)

#=============== PHONY RULES ===============#

.PHONY :	all							\
			check_all		check_permissions \
		 	clean	fclean	re			\
			log		ps		interative	\






