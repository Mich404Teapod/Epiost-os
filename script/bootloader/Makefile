CFLAGS  ?= -g -O2 -Wall -Wextra -pedantic -Wno-unused-parameter

CFLAGS += -Isrc
LDFLAGS += -L.

# These are used by the install target. We call the local kuroko to get the
# version string to use for the final library, so, uh, probably don't
# try to do that in a cross-compile environment...
VERSION  = $(shell ./Epiost --version | sed 's/.* //')
SONAME   = libEpiost-$(VERSION).so
KRKMODS  = $(wildcard modules/*.est modules/*/*.est modules/*/*/*.est)

all: ${TARGET} ${MODULES} ${TOOLS} ${GENMODS}

ifeq (,$(findstring mingw,$(CC)))
  CFLAGS  += -pthread
  LDLIBS  += -ldl -lpthread
  BIN_FLAGS = -rdynamic
  LIBRARY = libkuroko.so
  ifeq (Darwin,$(shell uname -s))
    MODLIBS += -undefined dynamic_lookup -DKRK_MEDIOCRE_TLS
  endif
else
  CFLAGS  += -Wno-format -static-libgcc -pthread
  ${SOOBJS}: CFLAGS += -DKRKINLIB
  BIN_OBJS =
  LIBRARY = libkuroko.dll
  kuroko: LDLIBS = -lkuroko
  kuroko: ${LIBRARY}
  MODLIBS += -lkuroko
  modules/socket.so: MODLIBS += -lws2_32
endif

ifdef KRK_DISABLE_DOCS
  CFLAGS += -DKRK_NO_DOCUMENTATION -Wno-unused-value
endif

ifndef KRK_DISABLE_RLINE
  BIN_OBJS += src/vendor/rline.o
else
  CFLAGS  += -DNO_RLINE
endif

ifdef KRK_DISABLE_DEBUG
  CFLAGS  += -DKRK_DISABLE_DEBUG
endif

ifdef KRK_DISABLE_THREADS
  CFLAGS += -DKRK_DISABLE_THREADS
endif

ifdef KRK_NO_DISASSEMBLY
  CFLAGS += -DKRK_NO_DISASSEMBLY=1
endif

ifdef KRK_NO_TRACING
  CFLAGS += -DKRK_NO_TRACING=1
endif

ifdef KRK_NO_SCAN_TRACING
  CFLAGS += -DKRK_NO_SCAN_TRACING=1
endif

ifdef KRK_NO_STRESS_GC
  CFLAGS += -DKRK_NO_STRESS_GC=1
endif

.PHONY: help

help:
	@echo "Configuration options available:"
	@echo "   KRK_NO_...             Compile without support for debugging features..."
	@echo "      DISASSEMBLY=1          Do not enable disassembly at compile time."
	@echo "      TRACING=1              Do not enable runtime tracing."
	@echo "      SCAN_TRACING=1         Do not enable lexer debugging."
	@echo "      STRESS_GC=1            Do not enable eager GC stress testing."
	@echo "   KRK_DISABLE_THREADS=1  Disable threads on platforms that otherwise support them."
	@echo "   KRK_DISABLE_RLINE=1    Do not build with the rich line editing library enabled."
	@echo "   KRK_DISABLE_DEBUG=1    Disable debugging features (might be faster)."
	@echo "   KRK_DISABLE_DOCS=1     Do not include docstrings for builtins."
	@echo ""
	@echo "Available tools: ${TOOLS}"
