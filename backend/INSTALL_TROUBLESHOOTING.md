# Installation Troubleshooting

## Issue: Microsoft Visual C++ 14.0 Required

If you encounter an error about Microsoft Visual C++ 14.0 when installing scikit-learn, this means pip is trying to build from source instead of using a pre-built wheel.

### Solution 1: Update scikit-learn (Recommended)

The requirements.txt has been updated to use a newer version of scikit-learn. Try installing again:

```bash
pip install -r requirements.txt --upgrade
```

### Solution 2: Install Pre-built Wheel Directly

If Solution 1 doesn't work, try installing scikit-learn directly from a wheel:

```bash
pip install scikit-learn --only-binary :all:
```

### Solution 3: Use Python 3.11 or 3.12 (Most Reliable)

Python 3.14 is very new and may not have pre-built wheels for all packages. Consider using Python 3.11 or 3.12, which have better package support:

1. Download Python 3.11 or 3.12 from python.org
2. Create a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

### Solution 4: Install Visual C++ Build Tools (If you must build from source)

If you need to build from source, download and install:
- Microsoft C++ Build Tools: https://visualstudio.microsoft.com/visual-cpp-build-tools/

Then try installing again:
```bash
pip install -r requirements.txt
```

### Solution 5: Use Conda (Alternative)

Conda often has pre-built packages available:

```bash
conda install scikit-learn joblib nltk flask flask-cors
```

Then install the remaining packages:
```bash
pip install Flask flask-cors
```

## Quick Test After Installation

After successful installation, test the backend:

```bash
python app.py
```

You should see:
```
✅ Model and vectorizer loaded successfully
 * Running on http://127.0.0.1:5000
```

If you see warnings about model files not found, that's normal - just place your .pkl files in the backend directory.

