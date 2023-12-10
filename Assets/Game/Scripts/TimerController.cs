using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class TimerController : MonoBehaviour
{
    public float initialTime;
    public float penalty;
    
    private float currentTime;
    private bool isPaused = true;
    private string gameOverScene = "GameOverScene"; 
    
    void Start()
    {
        DontDestroyOnLoad(gameObject);
        currentTime = initialTime;
    }

    void Update()
    {
        if (!isPaused && currentTime > 1)
        {
            currentTime -= Time.deltaTime;
        }
        else if (!isPaused)
        {
            SceneManager.LoadScene(gameOverScene);
        }
    }

    public void Captured()
    {
        currentTime -= penalty;
    }

    public float GetCurrentTime()
    {
        return currentTime;
    }

    public void PauseTimer()
    {
        isPaused = true;
    }

    public void ResumeTimer()
    {
        isPaused = false;
    }
}